import "dotenv/config";
import { Server } from "http";
import app from "./app";
import mongoDbConnect from "./app/config/mongodb.config";

const PORT = process.env.PORT || 3000;

let server: Server;

mongoDbConnect()
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err: any) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  });
