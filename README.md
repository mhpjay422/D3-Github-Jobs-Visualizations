# D3-Github-Jobs-Visualizations

### Architecture and Technologies

D3-Github-Jobs-Visualizations was built using:

* D3 v5.12.0

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


