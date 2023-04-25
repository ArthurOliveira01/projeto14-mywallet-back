import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const client  = new MongoClient('mongodb://127.0.0.1:27017' || process.env.DATABASE_URL);

client.connect().then(() => {
    
    console.log('conectou');
}).catch((err) => console.log(err.message))

export const db = client.db();;