import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import Joi from 'joi';
import {MongoClient} from 'mongodb';

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
    password: Joi.string().min(3).max(16)
});

app.post('/cadastro', async (req, res) =>{
    const name = req.body.name;
    const mail = req.body.email;
    const password = req.body.password;
    const validation = signupSchema.validate(req.body);

    try{
        if(validation.error){
            console.log(req.body);
            console.log('erro no validate');
            return res.sendStatus(402);
        }
        console.log(name);
        return res.status(200).send('passou da primeira parte')
    } catch{
        return res.send('ué');
    }
})

app.listen(5000);