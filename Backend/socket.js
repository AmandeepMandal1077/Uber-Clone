import { Server } from "socket.io";
import USER from "./models/user.model.js";
import CAPTAIN from "./models/captain.model.js";
import RIDE from "./models/ride.model.js";

let io;
const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("join", async (data) => {
      const { userId, userType } = data;

      console.log(`User ${userId} of type ${userType} joined`);
      if (userType == "user") {
        await USER.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType == "captain") {
        await CAPTAIN.findByIdAndUpdate(userId, { socketId: socket.id });
        //   socket.join(`captain_${userId}`);
      }
    });

    socket.on("update-captain-location", async (data) => {
      const { userId, location } = data;
      // console.log(`Captain ${userId} updated location:`, location);
      // const loc = location;
      if (!location || !location.latitude || !location.longitude) {
        console.error("Invalid location data");
        return;
      }

      await CAPTAIN.findByIdAndUpdate(userId, {
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      });

      // Broadcast location update to connected users in active rides
      const captain = await CAPTAIN.findById(userId).populate({
        path: "currentRide",
        populate: {
          path: "user",
          select: "socketId",
        },
      });

      if (
        captain &&
        captain.currentRide &&
        captain.currentRide.user &&
        captain.currentRide.user.socketId
      ) {
        socket.to(captain.currentRide.user.socketId).emit("location-update", {
          userId: userId,
          location: {
            lat: location.latitude,
            lng: location.longitude,
          },
          userType: "captain",
        });
      }

      // const captain = await CAPTAIN.findById(userId);
      // if (captain) {
      //   console.log("Captain location updated:", captain.location);
      // }
    });

    socket.on("update-location", async (data) => {
      const { userId, location, userType } = data;

      if (!location || !location.lat || !location.lng) {
        console.error("Invalid location data");
        return;
      }

      // Update location in database
      if (userType === "captain") {
        await CAPTAIN.findByIdAndUpdate(userId, {
          location: {
            latitude: location.lat,
            longitude: location.lng,
          },
        });

        // Find active rides with this captain
        const activeRides = await RIDE.find({
          captain: userId,
          status: { $in: ["confirmed", "ongoing"] },
        }).populate("user", "socketId");

        // Send location update to all users in active rides
        activeRides.forEach((ride) => {
          if (ride.user && ride.user.socketId) {
            socket.to(ride.user.socketId).emit("location-update", {
              userId: userId,
              location: location,
              userType: userType,
              rideId: ride._id,
            });
          }
        });
      } else if (userType === "user") {
        await USER.findByIdAndUpdate(userId, {
          location: {
            latitude: location.lat,
            longitude: location.lng,
          },
        });

        // Find active rides with this user
        const activeRides = await RIDE.find({
          user: userId,
          status: { $in: ["confirmed", "ongoing"] },
        }).populate("captain", "socketId");

        // Send location update to captain in active rides
        activeRides.forEach((ride) => {
          if (ride.captain && ride.captain.socketId) {
            socket.to(ride.captain.socketId).emit("location-update", {
              userId: userId,
              location: location,
              userType: userType,
              rideId: ride._id,
            });
          }
        });
      }
    });

    socket.on("new-ride", (data) => {
      console.log(data);
    });

    socket.on("ride-completed", async (data) => {
      console.log("Ride completed event received:", data);
      const { userId, rideId, fare } = data;

      try {
        // Find the user and send them the ride completion event
        const user = await USER.findById(userId);
        if (user && user.socketId) {
          sendMessage(user.socketId, {
            event: "ride-completed",
            data: { rideId, fare, message: "Your ride has been completed!" },
          });
          console.log(`Sent ride completion notification to user ${userId}`);
        }
      } catch (error) {
        console.error("Error sending ride completion notification:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);

      // Clean up socketId from users and captains when they disconnect
      USER.findOneAndUpdate(
        { socketId: socket.id },
        { $unset: { socketId: 1 } }
      ).exec();

      CAPTAIN.findOneAndUpdate(
        { socketId: socket.id },
        { $unset: { socketId: 1 } }
      ).exec();
    });
  });
};

const sendMessage = (socketId, message) => {
  if (io) {
    io.to(socketId).emit(message.event, message.data);
    console.log(`Sent message to ${socketId}:`, message);
  } else {
    console.error("Socket.io not initialized");
  }
};

export { initializeSocket, sendMessage };
