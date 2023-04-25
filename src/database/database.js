import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const client  = new MongoClient(process.env.DATABASE_URL);

client.connect().then(() => {
    
    console.log('conectou');
}).catch((err) => console.log(err.message))

export const db = client.db();;