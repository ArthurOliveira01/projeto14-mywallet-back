import { db } from "../database/database.js";
import { postSchema } from "../schemas/post.schema.js";




export const postDeal = async (req, res) =>{
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
}

export const getDeal = async (req, res) => {
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
}