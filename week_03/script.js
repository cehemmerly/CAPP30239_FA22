/* bar chart of covid cases */

d3.csv("covid.csv").then(data => {

    for (let d of data){
        d.cases = +d.cases; // + turns strings to int 
    };
    
    const height = 400,
        width = 600,
        margin = ({top:25, right:30, bottom:35, left:50});

    let svg = d3.select("#chart")  //target div with id = chart, d2.selectAll('p') would access all section w/ p 
                .append("svg")
                .attr("viewBox", [0, 0, width, height]); //viewBox allows you to resize based on screen size, 0,0 defines place to resize from*/

    const x = d3.scaleBand() //defines scale (categorical in this case, continuous below) 
                    .domain(data.map(d => d.country)) //by convention d is used to represent row of data 
                    .range([margin.left, width - margin.right]) //start at margin left and go to width minus margin right 
                    .padding(0.1);

    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.cases)]).nice() //.nice rounds to pretty # eg multiple of 10 
                .range([height - margin.bottom, margin.top]);

    const xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom + 5})`) //gives position of xaxis 
            .call(d3.axisBottom(x)); //inputs x scale to d3 to build axis 

    const yAxis = g => g
            .attr("transform", `translate(${margin.left - 5}, 0)`)
            .call(d3.axisLeft(y))

    svg.append("g") //g calls group 
        .call(xAxis);

    svg.append("g") //g calls group 
        .call(yAxis);

    let bar = svg.selectAll(".bar") //select all things w/ class bar, class bar defined further down 
            .append("g")
            .data(data)
            .join("g") //combines data w/ visual element, in this case bars 
            .attr("class", "bar");

    bar.append("rect")
        .attr("fill", "steelblue")
        .attr("x", d => x(d.country))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.cases))
        .attr("height", d => y(0) - y(d.cases)) //d3 builds from top down

    bar.append('text')
        .text(d => d.cases)
        .attr('x', d=> x(d.country) + (x.bandwidth()/2))
        .attr('y', d=> y(d.cases) + 15)
        .attr('text-anchor', 'middle')
        .style('fill', 'white');
});