const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./user');
const path = require('path')
const dotenv = require("dotenv");

dotenv.config();

console.log(process.env.DATABASE)

const DB = process.env.DATABASE
const port = process.env.PORT || 5000
console.log(DB)
mongoose.connect(DB,{
    useNewUrlparser: true,
    useUnifiedTopology: true
}).then(
    ()=>{
        console.log("connected") 
    }
).catch(e => console.log(e))

const app = express()
app.use(cors({
    origin: "*"
}))
const jsonParser = bodyParser.json()
app.listen(port)

app.get('/', (req, res) => {
    async function run(){
        const users = await User.find({})
        res.status(200).send(users)
        
    }
    run()
})

app.post('/',jsonParser, (req,res) => {
    async function run(){
        try{
            const user = await User.create({
                name: req.body.name,
                age: req.body.age,
                email: req.body.email
            }) 
            res.send("User's credentials saved to database!")
        }
        catch(err){
            res.send(err.message)
        }
    }
    run()
})

app.put('/',jsonParser , (req,res) => {
    async function run(){
        try{
            const user = await User.updateOne({
                _id: req.body.id
            },{
                name: req.body.name,
                age: req.body.age,
                email: req.body.email
            },{
                upsert: false
            });
            res.send(user.modifiedCount === 1 ? "User's credentials updated" : "ID not found in the database")
        }catch(err){
            console.log(err)
            res.send(err.message)
        }
    }
    run()
}) 

app.delete('/:id', (req,res) => {
    try{
        async function run(){
            if(req.params.id.length === 24){
                const user = await User.deleteOne({_id: req.params.id})
                console.log(user)
                res.send(user.deletedCount === 0 ? "No Match found" : "User deleted!")
            }else{
                res.send("Please provide a valid User_id")
            }
        }
        run()
    }
    catch(err){
        res.send(err.message)
    }
})
