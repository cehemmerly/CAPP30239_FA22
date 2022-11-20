/* Horizontal bar chart for COVID country cases */
// good for sorting and for long titles that won't fit nicely on x-axis

d3.csv('data/UTC_goals.csv').then((data) => {
	for (let d of data) {
		d.UTC = +d.UTC; //force a number
	}

	data.sort((a, b) => b.UTC - a.UTC); 

	const height = 600,
		width = 800,
		margin = { top: 25, right: 30, bottom: 45, left: 110 };

	let svg = d3
		.select('#bar-chart')
		.append('svg')
		.attr('viewBox', [0, 0, width, height]); // for resizing element in browser

	let x = d3
		.scaleLinear()
		.domain([0, d3.max(data, (d) => d.Goal_absolute)])
		.nice()
		.range([margin.left, width - margin.right]);

	let y = d3
		.scaleBand()
		.domain(data.map((d) => d.City)) //data.map() creating an array of the data from the country column
		.range([margin.top, height - margin.bottom])
		.padding(0.1);

	svg.append('g')
		.attr('transform', `translate(0,${height - margin.bottom + 5})`) // move location of axis
		.call(d3.axisBottom(x));

	svg.append('g')
		.attr('transform', `translate(${margin.left - 5},0)`)
		.call(d3.axisLeft(y));

    const bars = svg.append("g")
        .attr('class', 'bar')

    function updateChart(col) {

        // data.sort((a, b) => b[col] - a[col]); 

        // let x = d3
		// .scaleLinear()
		// .domain([0, d3.max(data, (d) => d.UTC)])
		// .nice()
		// .range([margin.left, width - margin.right]);

        // let y = d3
        //     .scaleBand()
        //     .domain(data.map((d) => d.City)) //data.map() creating an array of the data from the country column
        //     .range([margin.top, height - margin.bottom])
        //     .padding(0.1);

        // svg.append('g')
        //     .attr('transform', `translate(0,${height - margin.bottom + 5})`) // move location of axis
        //     .call(d3.axisBottom(x));

        // svg.append('g')
        //     .attr('transform', `translate(${margin.left - 5},0)`)
        //     .call(d3.axisLeft(y));

        bars.selectAll("g")
            .data(data)
            .join(
                enter => {
                let g = enter.append("g")

            g.append('rect') // add rect to bar group
                .attr('fill', (d) => (d.City == 'Chicago' ? 'green' : 'grey'))
                .attr('x', margin.left)
                .attr('width', (d) => x(d[col]) - margin.left)
                .attr('y', (d) => y(d.City))
                .attr('height', y.bandwidth())
                .attr('stroke', 'black');

            g.append('text') // add labels
                .text((d) => d[col])
                .attr('x', (d) => x(d[col]) - 10)
                .attr('y', (d) => y(d.City) + y.bandwidth() / 2)
                .attr('text-anchor', 'end')
                .attr('dominant-baseline', 'middle')
                .style('fill', 'white');

            g.append('text')
                .attr('class', 'x-label') // 'x-label' is just random name for this class
                .attr('text-anchor', 'end')
                .attr('x', width - margin.right)
                .attr('y', height - 5)
                .text('Percent Urban Canopy Cover');
        },
        update => {
            update.select("rect")
                .transition()
                .duration(750)
                .attr("y", d => y(d.City))
                .attr('width', (d) => x(d[col]) - margin.left)
                .attr('height', y.bandwidth())
                // .attr("height", d => height - margin.bottom - y(d.City));

            update.select("text")
                .text(d => d[col])
                .transition()
                .duration(750)
                .attr('x', (d) => x(d[col]) - 10)
                .attr("y", d => y(d.City) + y.bandwidth() / 2);
            },
            exit => {
            exit.select("rect")
                .transition()
                .duration(750)
                .attr("width", 0)
                // .attr("y", height - margin.bottom);

            exit.select("text")
                .text("");

            exit.transition()
                .duration(750)
                .remove();
            }
    )};

    updateChart("UTC");

    d3.selectAll("select")
        .on("change", function (event) {
            const col = event.target.value;
            updateChart(col); 
        });

    });
