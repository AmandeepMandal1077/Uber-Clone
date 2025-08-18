import { validationResult } from "express-validator";
import stripe from "../services/stripe.service.js";

const checkoutHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { item } = req.body; // Get items from the request body
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
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
    });

    res.json({ id: session.id, url: session.url }); // Send the session URL to the frontend
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export { checkoutHandler };
