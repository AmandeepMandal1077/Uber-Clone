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

  const userSocketMap = {};

  io.on("connection", (socket) => {
    socket.on("join", async ({ userId, userType }) => {
      if (userType === "user") {
        await USER.findByIdAndUpdate(userId, { socketId: socket.id });
      } else if (userType === "captain") {
        await CAPTAIN.findByIdAndUpdate(userId, { socketId: socket.id });
      }
      userSocketMap[socket.id] = { userId, userType };
    });

    socket.on("update-location", async ({ userId, location, userType }) => {
      if (userType === "captain") {
        const activeRide = await RIDE.findOne({
          captain: userId,
          status: { $in: ["confirmed", "ongoing"] },
        }).populate("user", "socketId");

        if (activeRide && activeRide.user && activeRide.user.socketId) {
          io.to(activeRide.user.socketId).emit("location-update", {
            userId,
            location,
            userType,
          });
        }
      }
    });

    socket.on("ride-completed", async ({ userId, rideId, fare }) => {
      const user = await USER.findById(userId);
      if (user && user.socketId) {
        io.to(user.socketId).emit("ride-completed", { rideId, fare });
      }
    });

    socket.on("disconnect", async () => {
      const userInfo = userSocketMap[socket.id];
      if (userInfo) {
        const { userId, userType } = userInfo;
        const location =
          userType === "user"
            ? (await USER.findById(userId))?.location
            : (await CAPTAIN.findById(userId))?.location;

        if (location) {
          if (userType === "user") {
            await USER.findByIdAndUpdate(userId, {
              location: {
                latitude: location.lat,
                longitude: location.lng,
              },
            });
          } else if (userType === "captain") {
            await CAPTAIN.findByIdAndUpdate(userId, {
              location: {
                latitude: location.lat,
                longitude: location.lng,
              },
            });
          }
        }
        delete userSocketMap[socket.id];
      }
    });
  });
};

const sendMessage = (socketId, message) => {
  if (io) {
    io.to(socketId).emit(message.event, message.data);
  }
};

export { initializeSocket, sendMessage };
