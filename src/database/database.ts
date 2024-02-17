import { Collection, Db, MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

export default class Database {
  // private uri: string = process.env.DATABASE_URI || '';
  // private dbName: string = process.env.DATABASE_NAME || '';
  // public db!: Db;
  // private client: MongoClient;
  // public collection!: Collection;
  private uri: string = 'mongodb://127.0.0.1:27017';
  private dbName: string = 'think_action';
  public db!: Db;
  private client: MongoClient;
  public collection!: Collection;

  constructor(collection: string) {
    try {
      this.client = new MongoClient(this.uri);
      this.client.connect();
      this.db = this.client.db(this.dbName);
      this.collection = this.db.collection(collection);
      console.log('Berhasil terhubung ke MongoDB');
    } catch (error) {
      console.error('Gagal terhubung ke MongoDB:', error);
      throw error;
    }
  }
}
