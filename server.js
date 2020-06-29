const express = require('express')
const app = express()
const path = require('path')
const fetch = require('node-fetch')
const host = '0.0.0.0';
const PORT = process.env.PORT || 5000;

app.set('port', PORT);

app.listen(PORT, host, function () {
    console.log("Server started.......");
});

// app.use(express.static(root))
app.use(express.static(path.join(__dirname, "./")))
// app.use(express.static(path.join(__dirname, "public")))

app.get('/api', (request, response) => {

    fetchData = () => {

        const urls = [
            "https://jobs.github.com/positions.json?page=1",
            "https://jobs.github.com/positions.json?page=2",
            "https://jobs.github.com/positions.json?page=3",
            "https://jobs.github.com/positions.json?page=4",
            "https://jobs.github.com/positions.json?page=5",
            "https://jobs.github.com/positions.json?page=6",
            "https://jobs.github.com/positions.json?page=7",
            "https://jobs.github.com/positions.json?page=8",
            "https://jobs.github.com/positions.json?page=9",
            "https://jobs.github.com/positions.json?page=10"
        ];

        const allRequests = urls.map(url =>
            fetch(url).then(response => response.json())
        );

        return Promise.all(allRequests);
    };

    fetchData().then(arrayOfResponses =>
        response.send(arrayOfResponses)
    );
});