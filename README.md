# D3-Github-Jobs-Visualizations

### Architecture and Technologies

D3-Github-Jobs-Visualizations was built using:

* D3 v5.12.0

* Node v.10.15.1

* Express-Node.js v4.17.1

* Node-fetch v2.6.0

* Javascript v9

* webpack v4.41.0

### Background and Overview

D3-Github-Jobs-Visualizations is a visualization that displays information about open positions on the Github jobs website using a barchart. It was a Javascript project for the App Academy software engineering bootcamp.

[Live Site] (http://www.d3githubjobsvisualization.com/)

gif placeholder

### Node server:

By implementing a simple node server, an api call is made to the githubjobs website to access all data for the open job positions. As an added benefit of creating the server to make the api call, I am able to avoid CORS (Cross-Origin Resource Sharing) issues. 

To make the api call, "node-fetch" is used on a list of page urls and consolidated using Promise.all.

```
const express = require('express')
const app = express()
const path = require('path')
const fetch = require('node-fetch')

app.listen(3000, () => console.log("3000"))

app.use(express.static(path.join(__dirname, "public")))

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
```

### Visualization

When the visualization is viewed, the data is displayed using a number of D3 tools. The purpose of using this visualization is to best and effectively communicate data to the end user.  Versus text and other means of communicating data, visually has been proved to be the best communicator.  The human brain is best at digesting and absorbing information that has been visually conveyed to them.  Visually communticating data has become an art with an assortment of different types of charts and graphs to use as tools to relay information.  I have selected a bar chart because amongst all the different options in selecting a visual tool, the bar chart has generally demonstrated itself to be the most effective. 



