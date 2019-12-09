import { 
    select, 
    scaleLinear, 
    scaleBand, 
    axisLeft, 
    axisBottom,  
    event
} from 'd3';

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
        '2018-10': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0,
            'company': {}
        },
        '2019-01': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0, 
            'company': {}
        },
        '2019-02': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0, 
            'company': {}
        },
        '2019-03': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0, 
            'company': {}
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
            'Contract': 0, 
            'company': {}
        },
        '2019-07': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0, 
            'company': {}
        },
        '2019-08': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0, 
            'company': {}
        },
        '2019-09': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0, 
            'company': {}
        },
        '2019-10': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0, 
            'company': {}
        },
        '2019-11': {
            'count': 0,
            'Full Time': 0,
            'Part Time': 0,
            'Contract': 0, 
            'company': {}
        },
    }

    json.forEach(page => {        
        db = db.concat(page)
    })    
    
    db.forEach(post => {
        let date = post.created_at.split(" ");
        let formatedDate = `${date[5]}-${months[date[1]]}`;
        let type = post.type;
        let company = post.company;
        
        (data[formatedDate]) 
            ? data[formatedDate].count = data[formatedDate].count + 1
            data[formatedDate][type] = data[formatedDate][type] + 1

            (data[formatedDate]['company'][company])
                ? data[formatedDate]['company'][company] = data[formatedDate]['company'][company] + 1
                : data[formatedDate]['company'][company] = 1

            : data[formatedDate] = {
                'count': 0,
                'Full Time': 0,
                'Part Time': 0,
                'Contract': 0,
                'company': {}
            }
            data[formatedDate].count = 1
            data[formatedDate][type] = 1
            data[formatedDate]['company'][company] = 1
        }
    })     

    let finalData = []
    
    Object.keys(data).sort().forEach( key => {
        
        finalData.push([`${months[key.slice(key.length - 2)]}  ${key.slice(2,4)}`, data[key]])
    });    

    render(finalData)
}

const width = document.body.clientWidth
const height = document.body.clientHeight
const xValue = d => d[1].count;
const yValue = d => d[0];
const margin = {
    top: 60,
    right: 60,
    bottom: 100,
    left: 220
};
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
let hoverRect = null;

const svg = select('svg')
const zoomG = svg
    .attr('width', width)
    .attr('height', height)
    .append('g');


const render = data => { 

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


    let tooltip = select("body").append("div")
        .attr("class", "tooltip")
        .style("visibility", "hidden");

    let tooltipClick = select("body").append("div")
        .attr("class", "tooltipClick")
        .style("visibility", "hidden")
        .style("top", margin.top + "px")
        .style("left", margin.left + "px")
        .style("height", 0)
        .style("width", 0)
        .on('click', () => {
            tooltipClick
                .style("visibility", "hidden")
                .style("height", 0)
                .style("width", 0)
                .style("cursor", "none")
        })

    const stringify = d => {

        let reformat = JSON.stringify(d[1]['company'])
            .replace("{", "")
            .replace("}", "")
            .split('"').join("")
            .replace(", Inc", " Inc")
            .split(',').join("*******")

        return d[0] + "<br/>" + "<br/>" + "Companies and their number of postings" + "<br/>" + "<br/>" + "<br/>" + reformat
    }

    const toggleHighlight = id => {
        if (id) {
            hoverRect = id;
            dimAxisText(id);
        } else {
            hoverRect = null;
            resetAxisText()
        }
        highlightBar();
    }

    const highlightBar = () => {

        barsEnter.select('rect')
            .attr('visibility', d =>
                d[0] === hoverRect || hoverRect === null ?
                1 :
                .4
            )
    }

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

    barsEnter
        .attr('class', 'bars')
        .merge(bars)
        .on('click', d => {
            tooltipClick
                .style("visibility", "visible")
                .style("height", innerHeight - innerHeight / 28 + "px")
                .style("width", innerWidth + "px")
                .style("cursor", "pointer")
                .html(stringify(d))
        })
        .on('mouseover', d => {
            toggleHighlight(d[0]);
            tooltip.transition()
                .duration(200)
                .style("visibility", "visible")
            tooltip.html(
                    `Open positions: ${d[1]['count']}` + "<br/>" + "<br/>" +
                    `Full Time: ${d[1]['Full Time']}` + "<br/>" +
                    `Part Time: ${d[1]['Part Time']}` + "<br/>" +
                    `Contract: ${d[1]['Contract']}`)
                .style("top", (event.pageY) + "px")
                .style("left", (event.pageX) + "px")
        })
        .on('mouseout', () => {
            toggleHighlight(null);
            tooltip.transition()
                .duration(500)
                .style("visibility", "hidden");
        })
    bars.exit().remove();
        
    g.append('text')
        .attr('class', 'title')
        .attr('fill', 'black')
        .attr('x', width / 3) 
        .attr('y', -20)
        .attr('text-anchor', 'middle')
        .text('Github Jobs Visualization')
}

