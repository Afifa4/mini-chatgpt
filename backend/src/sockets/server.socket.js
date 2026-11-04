import { Server } from "socket.io";
import { CLIENT_URL } from "../config/env.js";

let io;
export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: CLIENT_URL,
      credentials: true,
    },
  });

  console.log("Socket.io running");

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
  });
}
