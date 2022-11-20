//Scatter Plot of Chicago Tree Equity

d3.csv('data/chicago_tree_equity.csv').then(data => {

    let height = 400,
    width = 600,
    margin = ({ top: 25, right: 30, bottom: 50, left: 60 });
  
    const svg = d3.select("#scatter")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

    for (let d of data) {
        d.tes = +d.tes
        d.trees_planted = +d.trees_planted
        d.pctpoc = +d.pctpoc
        d.avg_temp = +d.avg_temp
    }

    let x = d3.scaleLinear()
        .domain(d3.extent(data, d => +d.tes)).nice()
        .range([margin.left, width - margin.right]);

    let y = d3.scaleLinear()
        .domain(d3.extent(data, d => +d.trees_planted)).nice()
        .range([height - margin.bottom, margin.top]);

    const C = d3.map(data, d => +d.avg_temp)

    const color = d3.scaleQuantize()
        .domain([15,25])
        .range(d3.schemeRdYlBu[6]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 10})`)
        .attr("class", "x-axis")
        .call(d3.axisBottom(x))

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).ticks(5))

    svg.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => x(d.tes))
        .attr("cy", d => y(d.trees_planted))
        .attr("r", d => d.pctpoc*10)
        .attr("fill", d => color(100 - d.avg_temp))
        .attr('stroke', 'black')
        .attr('stroke-width', 0.2)
        .attr("opacity", 0.75);

    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height-5)
        .text("American Forests Tree Equity Score");

    svg.append("text")
        .attr("class", "y-label")
        .attr("x", 10)
        .attr("y", 10)
        .text("# Trees Planted");

    const tooltip = d3.select("body").append("div")
        .attr("class", "svg-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden");

    d3.selectAll("circle")
        .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", "grey");
        tooltip
            .style("visibility", "visible")
            .html(`Neighborhood: ${d.community}<br>Number Trees Planted: ${d.trees_planted}<br>Tree Equity Score: ${d.tes.toFixed(1)}
            <br>%People of Color: ${(d.pctpoc*100).toFixed(0)}% <br>Average Summer Temp: ${d.avg_temp.toFixed(1)}°F`);
        })
        .on("mousemove", function(event) {
        tooltip
            .style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
        d3.select(this).attr("fill", d => color(100-d.avg_temp));
        tooltip.style("visibility", "hidden");
        })

    // var linear = d3.scaleQuantize()
    //     .domain([15,25])
    //     .range(d3.schemeRdYlBu[6]);
      
    // var legend_color = d3.select("#legend-color")
    //     .append("svg");
      
    // legend_color.append("g")
    // .attr("class", "legendLinear")
    // .attr("transform", "translate(20,20)");
    
    // var legendLinear = d3.legendColor()
    // .shapeWidth(30)
    // .cells(6)
    // .orient('horizontal')
    // .scale(linear);
    
    // legend_color.select(".legendLinear")
    // .call(legendLinear);

    d3.select(`#legend-color`)
    .node()
    .appendChild(
      Legend(
        d3.scaleOrdinal(
          ['85.4', '83.2', '81.7', '79.9', '78.2', '76.5'],
          d3.schemeRdYlBu[6]
        ),
        { title: "Average Summer Temperature" }
       ));

    var linearSize = d3.scaleLinear().domain(d3.extent(data, d => d.pctpoc*100)).range([5, 20]);

    var legend_size = d3.select("#legend-size")
        .append("svg");
    
    legend_size.append("g")
        .attr("class", "legendSize")
        .attr("transform", "translate(20, 40)");
    
    var legendSize = d3.legendSize()
        .scale(linearSize)
        .shape('circle')
        .shapePadding(20)
        .labelOffset(20)
        .labelFormat(d3.format(".0f"))
        .title('Percent People of Color')
        .orient('horizontal');
    
    legend_size.select(".legendSize")
        .call(legendSize);

    const annotation1 = [
        {
            note: {
            label: "Percent POC: 21%, Average Summer Temp: 77.9°F",
            title: "Lakeview",
            align: "right",  // try right or left
            wrap: 200,  // try something smaller to see text split in several lines
            padding: 10   // More = text lower
            },
            color: ["grey"],
            x: x(95.3),
            y: y(22.6),
            dy: -20,
            dx: -70
        }
        ]
        
    // Add annotation to the chart
    const makeAnnotation1 = d3.annotation()
        .annotations(annotation1)
    svg.append("g")
        .call(makeAnnotation1)

    const annotation2 = [
        {
            note: {
            label: "Percent POC: 83%, Average Summer Temp: 84.7°F",
            title: "Archer Heights",
            align: "right",  // try right or left
            wrap: 200,  // try something smaller to see text split in several lines
            padding: 10   // More = text lower
            },
            color: ["grey"],
            x: x(70.7),
            y: y(7.1),
            dy: -60,
            dx: 10
        }
        ]

    const makeAnnotation2 = d3.annotation()
        .annotations(annotation2)
    svg.append("g")
        .call(makeAnnotation2)
    
});