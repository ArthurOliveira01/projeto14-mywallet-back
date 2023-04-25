import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import Joi from 'joi';
import {MongoClient} from 'mongodb';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const client  = new MongoClient('mongodb://localhost:27017');
let db;

client.connect().then(() => {
    db = client.db();
    console.log('conectou');
}).catch((err) => console.log(err.message))

const signupSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().min(3).max(16).required()
});

const loginSchema = Joi.object({

    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().max(16).required()
});

app.post('/cadastro', async (req, res) =>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const validation = signupSchema.validate(req.body);

    try{
        if(validation.error){
            console.log(req.body);
            console.log('erro no validate');
            return res.sendStatus(422);
        }
        const passwordHash = bcrypt.hashSync(password, 10);
        const exists = await db.collection("accounts").findOne({email: email});
        if(exists){
            console.log('E-mail já cadastrado!')
            return res.sendStatus(409)
        }
        const intoDB = {
            name: name,
            email: email, 
            password: passwordHash
        };
        const sent = await db.collection("accounts").insertOne(intoDB);

        return res.sendStatus(201);
    } catch{
        return res.send('ué');
    }
});

app.post('/', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const validation = loginSchema.validate(req.body);
    try{
        if(validation.error){
            console.log(ué);
            return res.sendStatus(422);
        }
        const exists = await db.collection("accounts").findOne({email: email});
        if(exists){
            const hash = exists.password;
            const compare = bcrypt.compareSync(password, hash);
            if(compare){
                const token = uuid();
                await db.collection("accounts").insertOne({userId: exists._id, token})
                return res.status(200).send(token);
            }
            return res.sendStatus(401);
        }
        return res.sendStatus(404);
    } catch(err){
        console.log(err);
        return res.sendStatus(500);
    }

});

app.listen(5000);