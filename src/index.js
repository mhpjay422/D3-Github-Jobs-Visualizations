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
    ease
} from 'd3';

let data = null;

csv('data.csv').then(importData => {
    importData.forEach(d => {
        d.population = +d.population * 1000;
        d.id = d.population;
    });
    data = importData;
    render(importData);
})

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
let selectedRect = null;
let isSelected = false;



const render = data => {

    const onClick = id => {
        selectedRect = id;
        isSelected = !isSelected
        highlightBar(data);
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


    const barsG = g.append('g')

    const bars = barsG.selectAll('g')
        .data(data, d => d.id)

    const barsEnter = bars.enter().append('g')
    barsEnter
        .merge(bars)
            .on('click', d => { onClick(d.id); })
    bars.exit().remove();

    
    barsEnter.append('rect')
        .attr('y', d => yScale(yValue(d)))
        .attr('height', yScale.bandwidth())
    .merge(bars.select('rect'))
            .transition().duration(1500)
            .attr('width', d => xScale(xValue(d)));

    const highlightBar = () => barsEnter.select('rect')
        .attr('stroke-width', 5)
        .attr('stroke', d => d.id === selectedRect && !isSelected
            ? 'black' 
            : 'none'
        )

    barsEnter.append('text')
        .attr('class', 'rectText')
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .text(d => xAxisTickFormat(xValue(d)))
        .attr('y', d => yScale(yValue(d)) + 20)
    .merge(bars.select('text'))
            .transition().duration(1500)
            .attr('x', d => xScale(xValue(d)) - 25);
        
    svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2)
        .attr('y',45)
        .text('My Bar Chart')

}

