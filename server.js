const express = require('express')
const app = express()
const path = require('path')

app.listen(3000, () => console.log("hello"))

app.use(express.static(path.join(__dirname, "dist")))
app.use(express.static(path.join(__dirname, "public")))

// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/public/index.html');
// });

// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, "public/index.html"));
// });