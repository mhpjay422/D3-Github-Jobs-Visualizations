//src/index.js
import { 
    select, 
    csv, 
    scaleLinear, 
    scaleBand, 
    max, 
    axisLeft, 
    axisBottom, 
    format,
    zoom, 
    event,
    ease
} from 'd3';

let data = null;

csv('data.csv').then(importData => {
    importData.forEach(d => {
        d.population = +d.population * 1000;
        d.id = d.country;
    });
    data = importData;
    render(importData);
})

let tooltip = select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

const width = document.body.clientWidth
const height = document.body.clientHeight
const xValue = d => d.population;
const yValue = d => d.country;
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

    const xScale = scaleLinear()
        .domain([0, max(data, xValue)])
        .range([0, innerWidth]);
        
    const yScale = scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1);

    const xAxisTickFormat = number =>
        format('.3s')(number)
        .replace('G', 'B')
        .replace('M', 'M')
        .replace('0.00', '0');

    const xAxis = axisBottom(xScale)
        .tickFormat(xAxisTickFormat)
        .tickSize(-innerHeight)

    const g = zoomG.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    svg.call(zoom().on('zoom', () => {
        zoomG.attr('transform', event.transform)
    }))

    const leftAxis = g.append('g')
    leftAxis
        .call(axisLeft(yScale))
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

    xAxisG.select('.domain').remove();

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 60)
        .attr('x', innerWidth / 2)
        .attr('fill', '#635F5D')
        .text('POP') 


    const barsG = g.append('g')

    const bars = barsG.selectAll('g')
        .data(data, d => d.id)

    const barsEnter = bars.enter().append('g')

    barsEnter
        .attr('class', 'bars')
        .merge(bars)
            .on('click', d => { toggleSelectedBar(d.id); })
            .on('mouseover', d => { 
                toggleHighlight(d.id);
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9)
                tooltip.html("hello")
                    .style("left", "10px")
                    .style("top", "10px");
                    // .style("top", (d3.event.pageY - 28) + "px");
            })
            .on('mouseout', () => { 
                toggleHighlight(null);
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            })
    bars.exit().remove();

    barsEnter.append('rect')
        .attr('class', 'rect')
            .attr('y', d => yScale(yValue(d)))
            .attr('height', yScale.bandwidth())
        .merge(bars.select('rect'))
                .transition().duration(1500)
                .attr('width', d => xScale(xValue(d)));

    const toggleBar = () => barsEnter.select('rect')
        .attr('stroke-width', 5)
        .attr('stroke', d => 
        d.id === selectedRect && shouldToggle
            ? 'black' 
            : 'none'
        )

    const highlightBar = () => {

        barsEnter.select('rect')
            .attr('opacity', d =>
                d.id === hoverRect || hoverRect === null 
                ? 1 
                : .4
            )
    }
    
    barsEnter.append('text')
        .attr('class', 'rectText')
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .text(d => xAxisTickFormat(xValue(d)))
        .attr('y', d => yScale(yValue(d)) + 30)
    .merge(bars.select('text'))
            .transition().duration(1500)
            .attr('x', d => xScale(xValue(d)) - 25);
        
    g.append('text')
        .attr('class', 'title')
        .attr('x', width / 3) 
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .text('My Bar Charts')
}

