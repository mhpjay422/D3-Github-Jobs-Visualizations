//src/index.js
import { 
    select, 
    csv, 
    scaleTime,
    scaleLinear, 
    scaleBand, 
    max, 
    axisLeft, 
    axisBottom, 
    format,
    zoom, 
    event,
    scaleOrdinal,
    schemeCategory10,
    ease
} from 'd3';

// let jobs = require('../server.js')

// console.log(jobs);

getData();

async function getData() {
    const response = await fetch('/api');
    const json = await response.json();

    let months = {
        'Jan': "01",
        'Feb': "02",
        'Mar': "03",
        'Apr': "04",
        'May': "05",
        'Jun': "06",
        'Jul': "07",
        'Aug': "08",
        'Sep': "09",
        'Oct': "10",
        'Nov': "11",
        'Dec': "12",
        '01': "Jan",
        '02': "Feb",
        '03': "Mar",
        '04': "Apr",
        '05': "May",
        '06': "Jun",
        '07': "Jul",
        '08': "Aug",
        '09': "Sep",
        '10': "Oct",
        '11': "Nov",
        '12': "Dec"
    };

    let db = [];
    let data = {
        '2018-08': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0
        },
        '2018-09': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0
        },
        '2018-10': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0
        },
        '2019-01': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0
        },
        '2019-02': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0
        },
        '2019-03': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0
        },
        '2019-04': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0
        },
        '2019-05': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0
        },
        '2019-06': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0
        },
        '2019-07': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0
        },
        '2019-08': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0
        },
        '2019-09': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0
        },
        '2019-10': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0
        },
        '2019-11': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0
        },
        // '2019-12': {
        //     'count': 0,
        //     'Full Time': 0,
        //     'Part Time': 0,
        //     'Contract': 0
        // },
    }

    json.forEach(page => {        
        db = db.concat(page)
    })    

    // console.log(json);
    // console.log(data['2019-11'].Contract);
    
    db.forEach(post => {
        let date = post.created_at.split(" ");
        let formatedDate = `${date[5]}-${months[date[1]]}`
        let type = post.type

        // console.log(post);
        

        // console.log(formatedDate);
        
        
        if (data[formatedDate]) {
            data[formatedDate].count = data[formatedDate].count + 1
            data[formatedDate][type] = data[formatedDate][type] + 1
        } else {
            // console.log(formatedDate);
            data[formatedDate] = {
                'count': 0,
                'Full Time': 0,
                'Part Time': 0,
                'Contract': 0
            }
            data[formatedDate].count = 1
            data[formatedDate][type] = 1
        }
    }) 

    console.log(data);
    

    let finalData = []
    
    Object.keys(data).sort().forEach( key => {
        // console.log(key);
        
        finalData.push([`${months[key.slice(key.length - 2)]}  ${key.slice(2,4)}`, data[key]])
        // orderedData[key] = data[key];
    });


    console.log(finalData);
    
    render(finalData)
}




// csv('data.csv').then(importData => {
//     importData.forEach(d => {
//         d.population = +d.population * 1000;
//         d[0] = d.country;
//     });
//     data = importData;
//     render(importData);
// })

let tooltip = select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

let tooltipClick = select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

const width = document.body.clientWidth
const height = document.body.clientHeight
const xValue = d => d[1].count;
const yValue = d => d[0];
// const xValue = d => Object.keys(d);
// const yValue = d => Object.values(d);
const margin = {
    top: 60,
    right: 60,
    bottom: 100,
    left: 220
};
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
let selectedRect = null;
let willHighlight = null;
let shouldToggle = false;
let hoverRect = null;

const svg = select('svg')
const zoomG = svg
    .attr('width', width)
    .attr('height', height)
    .append('g');


const render = data => {

    // console.log(data);

    const toggleSelectedBar = id => {
        selectedRect = id;
        
        if (selectedRect === willHighlight) {
            shouldToggle = false;
            willHighlight = null;
        } else {
            shouldToggle = true;
            willHighlight = id;
        }
        toggleBar();
    }

    const toggleHighlight = id => {
        if(id) {
            hoverRect = id;
            dimAxisText(id);
        } else {
            hoverRect = null;
            resetAxisText()
        }
        highlightBar(); 
    }    

    const yScale = scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1);

    let maxScale = () => {
        let max = null;
        data.forEach( date => {
            // console.log(date[1].count);
            
            if (date[1].count > max) {
                max = date[1].count
            }
        })

        return max;
    }
        
    const xScale = scaleLinear()
        // .domain([0, 100])
        .domain([-1, maxScale() + 10])
        // .domain(data.map(yValue))
        .range([0, innerWidth])
        

    // const yAxisTickFormat = date =>
    //     date
    //     .replace('2018-10', 'Jan-2019')    
    //     .replace('2019-01', 'Jan-2019')    
    //     .replace('2019-01', 'Jan-2019')    
    //     .replace('2019-01', 'Jan-2019')    
    //     .replace('2019-01', 'Jan-2019')    
    //     .replace('2019-01', 'Jan-2019')    
    //     .replace('2019-01', 'Jan-2019')    
    //     .replace('2019-01', 'Jan-2019')    
    //     .replace('2019-01', 'Jan-2019')    
    //     .replace('2019-01', 'Jan-2019')    
    //     .replace('2019-01', 'Jan-2019')    
    //     .replace('2019-01', 'Jan-2019')    

    const xAxis = axisBottom(xScale)
        // .tickFormat(xAxisTickFormat)
        .tickSize(-innerHeight)

    const g = zoomG.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // svg.call(zoom().on('zoom', () => {
    //     zoomG.attr('transform', event.transform)
    // }))

    const leftAxis = g.append('g')
    leftAxis
        .call(axisLeft(yScale))
        // .call(axisLeft(yScale).tickFormat(yAxisTickFormat))
        .selectAll('.domain, .tick line')
            .remove();        

    leftAxis.selectAll('text')
        .attr('fill', '#635F5D')
        .attr('font-size', '2.7em')

    const dimAxisText = id => {

        leftAxis.selectAll('text')
            .filter(d => d === id )
            .attr('fill', 'black')
            .attr('font-weight', 'bold')

        leftAxis.selectAll('text')
            .filter(d => d !== id)
            .attr('fill', 'lightgrey')
    }

    const resetAxisText = () => {
        leftAxis.selectAll('text')
            .attr('fill', '#635F5D')
    }
    
    const xAxisG = g.append('g').call(xAxis)
        .attr('class', 'bottomtext')
        .attr('transform', `translate(0, ${innerHeight})`)

    xAxisG.selectAll('.domain, .tick line')
        .remove();

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 60)
        .attr('x', innerWidth / 2)
        .attr('fill', '#635F5D')
        .text('Number of posted open positions') 


    const barsG = g.append('g')

    const bars = barsG.selectAll('g')
        .data(data, d => d[0])

    const barsEnter = bars.enter().append('g')

    barsEnter
        .attr('class', 'bars')
        .merge(bars)
            .on('click', d => { 
                console.log(d[1]);
                
                toggleSelectedBar(d[0]) })
            .on('mouseover', d => { 
                toggleHighlight(d[0]);
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1)
                tooltip.html(
                            `Open positions: ${d[1]['count']}` + "<br/>" + "<br/>" +
                            `Full Time: ${d[1]['Full Time']}` + "<br/>" +  
                            `Part Time: ${d[1]['Part Time']}` + "<br/>" + 
                            `Contract: ${d[1]['Contract']}`)
                    // .style("top", select(this).attr('y') + "px")
                    // .style("left", select(this).attr('x') + "px")
                    .style("top", (event.pageY) + "px")
                    .style("left", (event.pageX) + "px")
                    // .style("left", "10px")
                    // .style("top", "10px");
                    // .style("top", (d3.event.pageY - 28) + "px");
            })
            .on('mouseout', () => { 
                toggleHighlight(null);
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
    bars.exit().remove();

    const colorScale = scaleOrdinal()

    colorScale
        .range(schemeCategory10)
    
    barsEnter.append('rect')
        .attr('class', 'rect')
            .attr('y', d => yScale(yValue(d)))
            .attr('height', yScale.bandwidth())
            .attr('fill', d => colorScale(yValue(d)))
        .merge(bars.select('rect'))
                .transition().duration(1500)
                .attr('width', d => {                    
                    if (d[1].count === 0) {
                       return 0 
                    } else {
                        return xScale(xValue(d))
                    }
                });

    const toggleBar = () => barsEnter.select('rect')
        .attr('stroke-width', 5)
        .attr('stroke', d => 
        d[0] === selectedRect && shouldToggle
            ? 'black' 
            : 'none'
        )

    const highlightBar = () => {

        barsEnter.select('rect')
            .attr('opacity', d =>
                d[0] === hoverRect || hoverRect === null 
                ? 1 
                : .4
            )
    }
    
    barsEnter.append('text')
        .attr('class', 'rectText')
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .text(d => d[1].count)
        .attr('y', d => yScale(yValue(d)) + 20)
    .merge(bars.select('text'))
            .transition().duration(1500)
            .attr('x', d => xScale(xValue(d)) - 12);
        
    g.append('text')
        .attr('class', 'title')
        .attr('fill', 'black')
        .attr('x', width / 3) 
        .attr('y', -20)
        .attr('text-anchor', 'middle')
        .text('Github Jobs Visualization')
}

