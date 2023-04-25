import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const port = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017';

const client  = new MongoClient(port);

client.connect().then(() => {
    
    console.log('conectou');
}).catch((err) => console.log(err.message))

export const db = client.db();