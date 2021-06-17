const express = require("express");
const fetch = require("node-fetch");
const app = express();
const path = require('path');
app.use(express.static('./public'))
var cors = require('cors');
const { request } = require("http");
app.options('*', cors()); 
app.use(express.json())

var comicNumber = 0

app.use((req, res, next) => {
    res.header({"Access-Control-Allow-Origin": "*"})
    next()
}) 

app.get("/:comicNumber", (req, res) => {
    comicNumber = req.params.comicNumber
    res.sendFile(path.join(__dirname, 'public/pageWithComicNumber.html'));
})

app.get("/api/getComicDataWithNumberURL",  async (req, res) => {
    
    const API = `https://xkcd.com/${comicNumber}/info.0.json`

    const response = await fetch(API)
    const json = await response.json()
    
    res.json(json)
})


app.get("/", (req, res, next) => {
    console.log("hello")
    res.sendFile(path.join(__dirname, 'public/homepage.html'));
});

app.get("/api/getComicData",  async (req, res) => {
    
    const API = `https://xkcd.com/info.0.json`;

    const response = await fetch(API)
    const json = await response.json()
    
    res.json(json)
})

app.post("/api/getComicDataWithNumber",  async (req, res) => {
    
    const API = `https://xkcd.com/${req.body.comicNumber}/info.0.json`

    const response = await fetch(API)
    const json = await response.json()
    
    res.json(json)
})



app.listen(process.env.PORT || 3001, () => console.log("Server running..."));