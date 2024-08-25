import { Request, Response } from "express";
import App from "./app";
import Database from "./database/database";

process.on('SIGINT', () => Database.disconnect('SIGINT'));
process.on('SIGTERM', () => Database.disconnect('SIGTERM'));

if (process.env.VERCEL === '1') {
  // If in Vercel, export the app for serverless function handling
  module.exports = async (req: Request, res: Response) => {
    const app = await App.init();
    app(req, res);
  };
} else {
  // If running locally, start the server normally
  App.init();
}