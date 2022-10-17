/* bar chart of library visits */

d3.csv("library_visits_jan22.csv").then(data => { //load data

    for (let d of data){
        d.num = +d.num; // convert 'num' column to integer
    };
    
    const height = 400, //define dimensions of the chart
        width = 600,
        margin = ({top:25, right:30, bottom:35, left:50});

    let svg = d3.select("#chart")  //target div with id = chart
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); //add viewbox to resize based on screen size

    const x = d3.scaleBand() //defines x as a categorical scale based on the 'branch' column of the data
        .domain(data.map(d => d.branch)) 
        .range([margin.left, width - margin.right]) 
        .padding(0.1);

    const y = d3.scaleLinear() //defines y as a continous scale based on the 'num' column of the data
        .domain([0, d3.max(data, d => d.num)]).nice() 
        .range([height - margin.bottom, margin.top]);

    svg.append("g") //creates a visual component for x-axis based on the x scale defined above
        .attr("transform", `translate(0,${height - margin.bottom + 5})`) 
        .call(d3.axisBottom(x));

    svg.append("g") //creates a visual component for y-axis based on the y scale defined above
        .attr("transform", `translate(${margin.left - 5}, 0)`)
        .call(d3.axisLeft(y))

    let bar = svg.selectAll(".bar") //links data to visual components with class 'bar'
        .append("g")
        .data(data)
        .join("g") 
        .attr("class", "bar");

    bar.append("rect") //define the formatting and position of the bar class based on the x and y scales
        .attr("fill", "steelblue")
        .attr("x", d => x(d.branch))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.num))
        .attr("height", d => y(0) - y(d.num)) 

    bar.append('text') //add the values of the 'num' column as text for each bar
        .text(d => d.num)
        .attr('x', d=> x(d.branch) + (x.bandwidth()/2))
        .attr('y', d=> y(d.num) + 15)
        .attr('text-anchor', 'middle')
        .style('fill', 'white');
});