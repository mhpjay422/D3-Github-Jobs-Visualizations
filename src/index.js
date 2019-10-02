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
    json, 
    fetch
} from 'd3';

const svg = select('svg')

const width = +svg.attr('width');
const height = +svg.attr('height');
const xValue = d => d.population;
const yValue = d => d.country;
const margin = {
    top: 50,
    right: 40,
    bottom: 70,
    left: 200
};
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const render = data => {

    const xScale = scaleLinear()
        .domain([0, max(data, xValue)])
        .range([0, innerWidth]);
        
    const yScale = scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xAxisTickFormat = number =>
        format('.3s')(number)
        .replace('G', 'B');

    const xAxis = axisBottom(xScale)
        .tickFormat(xAxisTickFormat)
        .tickSize(-innerHeight)

    g.append('g')
        .call(axisLeft(yScale))
        .selectAll('.domain, .tick line')
            .remove();

    const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`)

    xAxisG.select('.domain').remove();

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 70)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text('POP')

    const rects = g.selectAll('rect')
        .data(data)
    rects
        .enter().append('rect')
            .attr('y', d => yScale(yValue(d)))
            .attr('height', yScale.bandwidth())
        .merge(rects)
        .transition().duration(1500)
            .attr('width', d => xScale(xValue(d)))
    rects.exit().remove();

    svg.append('text')
            .attr('class', 'rectText')
            .attr('y', height / 2)
            .attr('x', 100)
            .text('bob')

    svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2)
        .attr('y',45)
        .text('My Bar Chart')
}

csv('data.csv').then(data => {
    data.forEach(d => {
         d.population = +d.population * 1000;
    });
    render(data);
})