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

D3-Github-Jobs-Visualizations is a visualization that displays information about open positions on the Github Jobs website using a barchart. It was a Javascript project for the App Academy software engineering bootcamp.

[Live Site] (http://www.d3githubjobsvisualization.com/)

gif placeholder

### Visualization

The purpose of using this visualization is to best and effectively communicate the data to the end user.  Versus text and other means of communicating data, visually has been proved to be the best communicator.  The human brain is best at digesting and absorbing information that has been visually conveyed to them.  Visually communticating data has become an art with an assortment of different types of charts and graphs to use as tools to relay information.  I have selected a bar chart because amongst all the different options in selecting a visual tool, the bar chart has generally demonstrated itself to be the most effective. 

### Node server

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

### D3 Tools

The data is displayed using a number of D3 tools to create the visual representation of the data.  From creating the axes using "axisLeft" and "axisBottom" to assigning the numerical domain and range on those axes using "scaleLinear" and "scaleBand". The "append" tool, is the crux of the D3 library.  It allows you to create an element (in the programming sense) or a construct in which you are able to style or shape into the design of choice.  

```
const yScale = scaleBand()
    .domain(data.map(yValue))
    .range([0, innerHeight])
    .padding(0.1);

const maxScale = () => {
    let max = null;
    data.forEach( date => {
        
        if (date[1].count > max) {
            max = date[1].count
        }
    })
    return max;
}
    
const xScale = scaleLinear()
    .domain([-1, maxScale() + 10])
    .range([0, innerWidth])  

const xAxis = axisBottom(xScale)
    .tickSize(-innerHeight)

const g = zoomG.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const leftAxis = g.append('g')
leftAxis
    .call(axisLeft(yScale))
    .selectAll('.domain, .tick line')
        .remove();        

leftAxis.selectAll('text')
    .attr('fill', '#635F5D')
    .attr('font-size', '2.7em')
```

### Animated Transitions

 To achieve animated transitions using D3, nesting grouping is required along with executing the transitions within the merge step of the general update pattern.  This is used to transition your objects size or position by continually adding and remove a new/different object on-screen. This effect continues until the desired result is achieved resulting in an effect that is viewed as an object that is moving. 
 
 ```
 const barsG = g.append('g')

const bars = barsG.selectAll('g')
    .data(data, d => d[0])

const barsEnter = bars.enter().append('g')

barsEnter.append('rect')
    .attr('class', 'rect')
        .attr('y', d => yScale(yValue(d)))
        .attr('height', yScale.bandwidth())
    .merge(bars.select('rect'))
            .transition().duration(1500)
            .attr('width', d => {                    
                (d[1].count === 0) 
                    ? 0 
                    : xScale(xValue(d))
            });

barsEnter.append('text')
    .attr('class', 'rectText')
    .attr('fill', 'white')
    .attr('text-anchor', 'middle')
    .text(d => d[1].count)
    .attr('y', d => yScale(yValue(d)) + 20)
.merge(bars.select('text'))
        .transition().duration(1500)
        .attr('x', d => xScale(xValue(d)) - 12);
 ``` 
 
 
