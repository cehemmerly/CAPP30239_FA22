// Histogram & Joins

const height = 400,
    width = 600,
    margin = ({ top: 25, right: 10, bottom: 50, left: 10 }),
    padding = 1;

const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

d3.json('a3cleanedonly2015.json').then((data) => {      

    const x = d3.scaleLinear()
        .range([margin.left, width - margin.right])
        .domain(d3.extent(data, d => d.Age)).nice();
  
    const y = d3.scaleLinear()
        .range([height - margin.bottom, margin.top])
        .domain([0,210]);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom + 5})`)
        .call(d3.axisBottom(x));

    const binGroups = svg.append("g")
        .attr("class", "bin-group");

    function updateChart(m) {
        const filtered = data.filter(a => a.Race == m);

        const bins = d3.bin()
            .domain([0,90])
            .thresholds([10,20,30,40,50,60,70,80,90])
            .value(d => d.Age)(filtered);

        binGroups.selectAll("g")
            .data(bins, d => d.x0)
        .join(
            enter => {
            let g = enter.append("g") //enter builds the graph based on default selection

            g.append("rect")
                .attr("x", d => x(d.x0) + padding / 2)
                .attr("y", height - margin.bottom)
                .attr("width", d => x(d.x1) - x(d.x0) - padding)
                .attr("height", 0)
                .attr("fill", "steelblue")
                .transition()
                .duration(750)
                .attr("y", d => y(d.length))
                .attr("height", d => height - margin.bottom - y(d.length));

            g.append("text")
                .text(d => d.length == 0 ? "" : d.length)
                .attr("x", d => x(d.x0) + (x(d.x1) - x(d.x0)) / 2)
                .attr("y", height - margin.bottom - 5)
                .attr("text-anchor", "middle")
                .attr("fill", "#333")
                .transition()
                .duration(750)
                .attr("y", d => y(d.length) - 5);
            },
            update => { //sets new parameters for the graph when new selection is made
            update.select("rect")
                .transition()
                .duration(750)
                .attr("y", d => y(d.length))
                .attr("height", d => height - margin.bottom - y(d.length));

            update.select("text")
                .text(d => d.length == 0 ? "" : d.length)
                .transition()
                .duration(750)
                .attr("y", d => y(d.length) - 5);
            },
            exit => { //removes the old graph when new selection is made
            exit.select("rect")
                .transition()
                .duration(750)
                .attr("height", 0)
                .attr("y", height - margin.bottom);

            exit.select("text")
                .text("");

            exit.transition()
                .duration(750)
                .remove();
            }
        );

    }

    updateChart("Black");

    d3.selectAll("select") //this updates the graph based on the month selected
        .on("change", function (event) {
            const m = event.target.value;
            console.log(m)
            updateChart(m); //function defined above
        });
});