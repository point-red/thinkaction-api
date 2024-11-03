import { Collection, Db, MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

export default class Database {
  private uri: string = process.env.MONGODB_URI as string;
  private dbName: string = process.env.DATABASE_NAME as string;
  public db!: Db;
  private client: MongoClient;
  public collection!: Collection;

  constructor(collection: string) {
    try {
      this.client = new MongoClient(this.uri);
      this.client.connect();
      this.db = this.client.db(this.dbName);
      this.collection = this.db.collection(collection);
      console.log("Berhasil terhubung ke MongoDB");
    } catch (error) {
      console.error("Gagal terhubung ke MongoDB:", error);
      throw error;
    }
  }
}
