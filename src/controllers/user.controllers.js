import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import { db } from "../database/database.js";
import { signupSchema } from "../schemas/signup.schema.js";
import {loginSchema} from "../schemas/login.schema.js";


export const signup = async (req, res) => {
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
}

export const login = async(req, res) => {
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
}