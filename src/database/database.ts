import { Collection, Db, MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

export default class Database {
  private static uri: string = process.env.DATABASE_URI || 'mongodb+srv://zildanmarginata:9i0GEZR8vImJTcuI@mymongodb.htazbwd.mongodb.net/mymongodb?retryWrites=true&w=majority';
  private dbName: string = 'think_action';
  public db!: Db;
  private client: MongoClient | undefined;
  private static client: MongoClient;
  public collection!: Collection;

  constructor(collection: string) {
    try {
      this.connect(collection);
    } catch (error) {
      console.error('Gagal terhubung ke MongoDB:', error);
      throw error;
    }
  }

  public static async init() {
    let client = new MongoClient(Database.uri, {
      tlsAllowInvalidHostnames: true,
      retryReads: true,
      retryWrites: true,
    });
    global.mongodbClient = client;
    client = await client.connect();
    console.log("Connected to MongoDB.");
    return client;
  }

  private async connect(collection: string) {
    if (!global.mongodbClient) {
      await Database.init();
    }
    this.client = global.mongodbClient;
    this.db = this.client.db(this.dbName);
    this.collection = this.db.collection(collection);

    const collections = await this.db.listCollections({ name: collection }).toArray();

    if (collections.length === 0) {
      await this.db.createCollection(collection);
      console.log(`Collection '${collection}' created.`);
    }

    this.collection = this.db.collection(collection);
  }

  public static disconnect(signal: string) {
    console.log(`Received ${signal}. Closing MongoDB connection...`);
    if (global.mongodbClient) {
      global.mongodbClient.close().then(() => {
        process.exit();
      });
    }
  }
}
