import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const client  = new MongoClient(process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017');

client.connect().then(() => {
    
    console.log('conectou');
}).catch((err) => console.log(err.message))

export const db = client.db();