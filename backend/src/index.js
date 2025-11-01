import dotenv from "dotenv"
import app from "./app.js"
import http from "http";
import connectDB from "./db/index.js"
import { Server } from "socket.io";
import { Message } from "./models/messages.models.js";

//load .env variables to node.js application
dotenv.config({ path: "./.env" });

const port = process.env.PORT || 3000;

//starts express server after connecting to mongodb
connectDB()
  .then(() => {
    // Create HTTP server
    const server = http.createServer(app);

    // Setup Socket.io
    const io = new Server(server, {
      cors: {
        origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:8082"],
        credentials: true,
        methods: ["GET", "POST"],
      },
    });

    // Make io accessible to routes
    app.set('io', io);

    // Socket events
    io.on("connection", (socket) => {
      console.log("✅ New user connected:", socket.id);

      // Join chat room (conversation)
      socket.on("joinRoom", (conversationId) => {
        socket.join(conversationId);
        console.log(`User joined room: ${conversationId}`);
      });

      // Send message event
      socket.on("sendMessage", async (data) => {
        try {
          const { conversationId, sender, text, fileUrl } = data;

          // Save message to DB
          const message = await Message.create({
            conversationId,
            sender,
            text,
            fileUrl,
          });

          // Populate sender info before emitting
          const populatedMessage = await Message.findById(message._id).populate("sender", "name email role");

          // Emit message to all users in that conversation
          io.to(conversationId).emit("newMessage", populatedMessage);
        } catch (error) {
          console.error("Error saving message:", error);
        }
      });

      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
      });
    });

    // Start both HTTP + Socket server
    server.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });