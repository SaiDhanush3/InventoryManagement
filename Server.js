const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db;
var s;

MongoClient.connect('mongodb://localhost:27017/footwear',(err,database)=>{
    if(err) return console.log(err)
    db = database.db('footwear')
    app.listen(5000,()=>{
        console.log('Listening at the port number 5000')
    })
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/',(req,res)=>{
    db.collection('footwear info').find().toArray((err,result)=>{
        if(err) return console.log(err)
        res.render('homepage.ejs',{data : result})

    })
})

app.get('/create',(req,res)=>{
    res.render("add.ejs")
})

app.get('/updatestock',(req,res)=>{
    res.render("update.ejs")
})

app.get('/delete',(req,res)=>{
    res.render("delete.ejs")
})


app.post('/AddData',(req,res)=>{
    db.collection('footwear info').find().toArray((err,result)=>{
        if(err) return console.log(err)
        db.collection('footwear info').save(req.body, (err,result)=>{
            if(err) return console.log(err)
            res.redirect('/')
        })
    }) 
})

app.post('/update',(req,res)=>{
    db.collection('footwear info').find().toArray((err,result)=>{
        if(err) return console.log(err)
        for(var i=0;i<result.length;i++){
            if(result[i].pid==req.body.pid){
                s=result[i].stock
                break
            }
        }
        db.collection('footwear info').findOneAndUpdate({pid : req.body.pid},{
            $set: {stock: parseInt(s)+parseInt(req.body.stock)}},
            (err,result)=>{
                if(err) return res.send(err)
                res.redirect('/')
            })
    })
})

app.post('/delete',(req,res)=>{
    db.collection('footwear info').findOneAndDelete({pid:req.body.pid},(err,result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    })
})