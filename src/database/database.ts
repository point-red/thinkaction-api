import { Collection, Db, MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

export default class Database {
  private uri: string = process.env.DATABASE_URI || 'mongodb+srv://zildanmarginata:9i0GEZR8vImJTcuI@mymongodb.htazbwd.mongodb.net/mymongodb?retryWrites=true&w=majority';
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
