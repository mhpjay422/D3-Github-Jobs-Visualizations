const express = require('express')
const app = express()
const path = require('path')
const fetch = require('node-fetch')
const PORT = process.env.PORT || 8000;

app.listen(3000, () => console.log("3000"))

// app.use(express.static(path.join(__dirname, "dist")))
app.use(express.static(path.join(__dirname, "public")))
// app.use(express.static(root))
// app.use(express.static(__dirname));
// app.use(express.static(path.join(__dirname, "public")))
// app.use(express.static('public'))

// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/public/index.html');
// });

// let results = null;






app.get('/api', (request, response) => {

    fetchData = () => {

                // let i = 0
                // let urls = []

                // while (fetch(`https://jobs.github.com/positions.json?page=${i}`).then(res => res.json) !== {}) {
                //     urls.push(`https://jobs.github.com/positions.json?page=${i}`)
                //     i++
                // }
                
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


    // let urls = [];

    // for (let index = 1; index < 10; index++) {

    //     let url = `https://jobs.github.com/positions.json?page=${index}`
    //     fetch(url).then((response) => {
    //         return response.text();
    //     }).then((body) => {
    //         results = JSON.parse(body);

    //         if (results !== []) {
    //             urls.push(url)
    //         }
    //     })
    // }

    // console.log(urls);


    // for (let index = 1; true; index++) {
    //     let data = fetch(`https://jobs.github.com/positions.json?page=${index}`)
    //     let exit = false;
    //     let dataArray = []        

    //     data.then((response) => {
    //         // console.log(response);

    //         return response.text();
    //     }).then((body) => {
    //         results = JSON.parse(body)
    //         let array = [];
    //         results.forEach(obj => {
    //             array.push(obj);                
    //         });

    //         dataArray = array;
    //         console.log(dataArray);
    //         // console.log(results) // logs to server
    //     });
    //     if (index === 9) {
    //         exit = true
    //     }        
    //     if (exit) {

    //         final = dataArray
    //         break
    //     }

    // }  

    // response.send(final) // sends to frontend

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