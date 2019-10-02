//src/index.js
import { 
    select, 
    csv, 
    scaleLinear, 
    scaleBand, 
    max, 
    axisLeft, 
    axisBottom, 
    format
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

    const xAxisTickFormat = number =>
        format('.3s')(number)
        .replace('G', 'B')
        .replace('M', 'M');

    const xAxis = axisBottom(xScale)
        .tickFormat(xAxisTickFormat)
        .tickSize(-innerHeight)

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

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

    const bar = g.append('g')
        .data(data)
    bar
        .enter().append('g')
        .merge(bar)
    bar.exit().remove();

    const rects = bar.selectAll('rect')
        .data(data);
    rects
        .enter().append('rect')
            .attr('y', d => yScale(yValue(d)))
            .attr('height', yScale.bandwidth())
        .merge(rects)
            .transition().duration(1500)
            .attr('width', d => xScale(xValue(d)))
    rects.exit().remove();    

    const rectText = bar.selectAll('text')
        .data(data)
    rectText
        .enter().append('text')
            .attr('class', 'rectText')
            .attr('x', d => xScale(xValue(d)) - 25)
            .attr('y', d => yScale(yValue(d)) + 20)
            .attr('fill', 'white')
            .attr('text-anchor', 'middle')
            .text(d => xAxisTickFormat(xValue(d)))
    rectText.exit().remove();


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