/* Horizontal bar chart for COVID country cases */
// good for sorting and for long titles that won't fit nicely on x-axis

d3.csv("covid.csv").then(data => {

    for (let d of data) {
        d.cases = +d.cases; //force a number
    };

    data.sort((a, b) => b.cases - a.cases); //sorts from biggest to smallest top to bottom
    // data.sort((a, b) => d3.ascending(b.country, a.country)); //sorts alphabetical

    const height = 600,
          width = 800,
          margin = ({ top: 25, right: 30, bottom: 45, left: 50 });

    let svg = d3.select("#horizontal-chart")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); // for resizing element in browser

    let x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.cases)]).nice()
        .range([margin.left, width - margin.right]);
    
    let y = d3.scaleBand()
        .domain(data.map(d => d.country)) //data.map() creating an array of the data from the country column
        .range([margin.top, height - margin.bottom])
        .padding(0.1);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`) // move location of axis
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y));

    let bar = svg.selectAll(".bar") // create bar groups
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar");

    bar.append("rect") // add rect to bar group
        .attr("fill", "steelblue")
        .attr("x", margin.left)
        .attr("width", d => x(d.cases))
        .attr("y", d => y(d.country))
        .attr("height", y.bandwidth());
    
    bar.append('text') // add labels
        .text(d => d.cases)
        .attr('x', d => margin.left + x(d.cases) - 10)
        .attr('y', d => y(d.country) + (y.bandwidth()/2))
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .style('fill', 'white');

    svg.append("text")
        .attr("class", "x-label") // 'x-label' is just random name for this class
        .attr("text-anchor", "end")
        .attr("x", width-margin.right)
        .attr("y", height)
        .text("Country Code")

});