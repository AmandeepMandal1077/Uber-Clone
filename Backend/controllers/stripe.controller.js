import { validationResult } from "express-validator";
import stripe from "../services/stripe.service.js";
import RIDE from "../models/ride.model.js";

import dotenv from "dotenv";
dotenv.config();

const checkoutHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { item, rideId } = req.body; // Get items from the request body
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: item.currency,
            product_data: {
              name: item.name,
              description: item.description,
            },
            unit_amount: item.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // IMPORTANT: Replace with your actual website URLs
      success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}`,
      metadata: {
        rideId: rideId,
      },
    });

    res.json({ id: session.id, url: session.url }); // Send the session URL to the frontend
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const rideId = session.metadata.rideId;
    const paymentIntentId = session.payment_intent;

    // Fulfill the ride booking
    try {
      const ride = await RIDE.findByIdAndUpdate(rideId, {
        status: "confirmed", // Update the status
        paymentId: paymentIntentId, // Store the unique Payment Intent ID
        signature: sig,
      });

      console.log(`Successfully confirmed ride ${rideId}`);
    } catch (err) {
      console.error("Error updating ride in database:", err);
      // If this fails, you should have a retry mechanism or alert system
      return res.status(500).json({ error: "Database update failed." });
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
};

export { checkoutHandler, stripeWebhookHandler };
