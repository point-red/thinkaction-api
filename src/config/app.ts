import { config } from "dotenv";

config();

export const appName = "pointhub-thinkaction";
export const apiUrl = process.env.API_URL || "https://api-think-action.vercel.app/v1/notifications";
export const appUrl = process.env.APP_URL || "https://think-action.vercel.app";
