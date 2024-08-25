import App from "./app";
import Database from "./database/database";

App.init()

process.on('SIGINT', () => Database.disconnect('SIGINT'));
process.on('SIGTERM', () => Database.disconnect('SIGTERM'));

module.exports = App;