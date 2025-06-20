"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoDbConnect = () => {
    return mongoose_1.default.connect(`${process.env.MONGO_DB_URL}`).then(() => {
        console.log('✅ DB is connected');
    }).catch((err) => {
        console.log('❌ DB connection failed:', err);
        throw err;
    });
};
exports.default = mongoDbConnect;
