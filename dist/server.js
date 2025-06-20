"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const mongodb_config_1 = __importDefault(require("./app/config/mongodb.config"));
const PORT = process.env.PORT || 3000;
let server;
(0, mongodb_config_1.default)()
    .then(() => {
    server = app_1.default.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
});
