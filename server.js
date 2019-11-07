const express = require('express')
const app = express()
const path = require('path')
const fetch = require('node-fetch')
const PORT = process.env.PORT || 8000;

app.listen(3000, () => console.log("3000"))

// app.use(express.static(path.join(__dirname, "dist")))
app.use(express.static(path.join(__dirname, "public")))

// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/public/index.html');
// });

// let results = null;

app.get('/api', (request, response) => {
     fetch(`https://jobs.github.com/positions.json?page=1`)
            .then((response) => {
                // console.log(response);

                return response.text();
            }).then((body) => {
                results = JSON.parse(body)
                // console.log(results) // logs to server
                response.send(results) // sends to frontend
            });
});

// app.listen(PORT, () => {
//     console.log(__dirname);
//     console.log(`listening on ${PORT}`)
// })

// let data = fetch(`https://jobs.github.com/positions.json?page=1`).then((response) => {
//     console.log(response);

//     return response;
// })

// console.log(data);


// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, "public/index.html"));
// });

// module.exports.data = data;