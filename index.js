const express = require("express");
const app = express();
const path = require('path');
app.use(express.static('./public'))
var cors = require('cors')
app.use(cors())


app.get("/", (req, res) => {
    
    res.sendFile(path.join(__dirname, 'public/homepage.html'));
});

// app.get("/:comicNumber", (req, res) => {
//     console.log("hey")
//     res.send("hi")
// })

app.listen(process.env.PORT || 3000, () => console.log("Server running..."));