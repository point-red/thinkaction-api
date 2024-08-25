import App from "./app";
import Database from "./database/database";

const PORT: Number = Number(process.env.PORT) || 5050;

App.init().then((app) => {
  app.listen(PORT, (): void => console.log(`running on port ${PORT}`));
})

process.on('SIGINT', () => Database.disconnect('SIGINT'));
process.on('SIGTERM', () => Database.disconnect('SIGTERM'));
