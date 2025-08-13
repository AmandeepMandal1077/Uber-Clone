import http from "http";
import app from "./app.js";
import { initializeSocket, sendMessage } from "./socket.js";
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`server is running on: ${PORT}`);
});
