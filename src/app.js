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
console.log('1');
const client  = new MongoClient('mongodb://0.0.0.0:27017/');
console.log('2');
let db;

client.connect().then(() => {
    console.log('teste');
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

const postSchema = Joi.object({
    text: Joi.string().min(3).max(13).required(),
    value: Joi.number().min(0.1).required()
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
                await db.collection("accounts").insertOne({userId: exists._id, token: token})
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

app.post('/nova-transacao/:tipo', async (req, res) =>{
    const type = req.params;
    const authorization = req.headers.authorization;
    const value = req.body.value;
    value?.toFixed(1);
    const text = req.body.text;
    const validation = postSchema.validate(req.body);

    if(authorization === undefined){
        return res.sendStatus(401);
    }
    if(type.tipo !== ':saida' && type.tipo !== ':entrada'){ 
        return res.sendStatus(422);
    }
    const token = authorization.replace("Bearer ", "");
    try{
        if(validation.error){
            return res.sendStatus(422);
        }
        const exists = await db.collection("accounts").findOne({token: token});
        if(exists){
            const id = exists.userId;
            const final = type.tipo.replace(":", "");
            const data = new Date();
            console.log(data)
            const intoDB = {
                userId: id,
                type: final,
                value: value,
                text: text,
                date: `${data.getDate()}/${data.getMonth()}`
            };
            console.log(intoDB);
            const sent = await db.collection("deals").insertOne(intoDB);
            return res.sendStatus(200);
        }
        return res.sendStatus(422);   
    } catch(err){
        console.log(err);
        return res.sendStatus(500);
    }
});

app.get('/home', async (req, res) =>{
    const authorization = req.headers.authorization;
    if(authorization === undefined){
        return res.sendStatus(401);
    }
    const token = authorization.replace("Bearer ", "");
    try{
        const exists = await db.collection("accounts").findOne({token: token});
        if(exists){
            const id = exists.userId;
            console.log(exists);
            console.log(id);
            const deals = await db.collection("deals").find({userId: id}).toArray();
            let k = 0;
            let type = [];
            let value = [];
            let text = [];
            let date = [];
            while(k < deals.length){
                type.push(deals[k].type);
                value.push(deals[k].value);
                text.push(deals[k].text);
                date.push(deals[k].date);
                k++;
            }
            let sent = {
                type: type,
                value: value,
                text: text,
                date: date
            }
            return res.status(200).send(sent);
        }
    } catch{
        return res.sendStatus(500);
    }
});

app.listen(5000);