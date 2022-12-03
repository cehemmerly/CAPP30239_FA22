/* Horizontal bar chart for Urban Canopy in US Cities*/

d3.csv("data/UTC_goals.csv").then(data => {

    for (let d of data) {
        d.UTC = +d.UTC; 
    };

    data.sort((a, b) => b.UTC - a.UTC); 
    
    const height = 600,
          margin = ({ top: 50, right: 70, bottom: 45, left: 110 });

    const width = d3.select("#bar-chart")
          .node()
          .getBoundingClientRect().width;

    let svg = d3.select("#bar-chart")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]); 

    let x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Goal_absolute)]).nice()
        .range([margin.left, width - margin.right]);
    
    let y = d3.scaleBand()
        .domain(data.map(d => d.City)) 
        .range([margin.top, height - margin.bottom])
        .padding(0.1);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`) 
        .call(d3.axisBottom(x));
    
    svg.append("g")
        .attr("transform", `translate(${margin.left - 5},0)`)
        .call(d3.axisLeft(y));

    let bar2 = svg.selectAll(".bar2") 
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar2");

    bar2.append("rect") 
        .attr("fill", "white")
        .attr("x", margin.left)
        .attr("width", d => x(d.Goal_absolute) - margin.left)
        .attr("y", d => y(d.City))
        .attr("height", y.bandwidth())
        .attr("stroke", "black");
    
    let bar1 = svg.selectAll(".bar1") 
        .append("g")
        .data(data)
        .join("g")
        .attr("class", "bar1"); 

    bar1.append("rect")
        .attr("fill", d => d.City == 'Chicago' ? "#196F3D" : "#BCCDA4")
        .attr("x", margin.left)
        .attr("width", d => x(d.UTC) - margin.left)
        .attr("y", d => y(d.City))
        .attr("height", y.bandwidth());
    
    bar1.append('text') 
        .text(d => d.UTC)
        .attr('x', d => x(d.UTC)-10)
        .attr('y', d => y(d.City) + (y.bandwidth()/2))
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .style('fill', d => d.City == 'Chicago' ? "white" : "black");


    const annotation1 = [
        {
            note: {
            label: "Current Urban Canopy (%)",
            align: "left",  
            wrap: 200, 
            padding: 10   
            },
            color: ["grey"],
            x: x(47),
            y: y("Atlanta"),
            dy: -10,
            dx: 10
        }
        ]
        
    const makeAnnotation1 = d3.annotation()
    .annotations(annotation1)
    svg.append("g")
    .call(makeAnnotation1)

    const annotation2 = [
        {
            note: {
            label: "City Canopy Goal (%)",
            align: "left",  
            wrap: 200,  
            padding: 10   
            },
            color: ["grey"],
            x: x(40),
            y: y("Seattle") - 2,
            dy: 70,
            dx: 70
        }
        ]
        
    const makeAnnotation2 = d3.annotation()
    .annotations(annotation2)
    svg.append("g")
    .call(makeAnnotation2)

    svg.selectAll(".connector")
        .attr('stroke', "grey")
        .style("stroke-dasharray", ("3, 3"))

});