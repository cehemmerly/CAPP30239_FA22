//Horizontal Stacked Bar Chart

d3.csv("data/UTC_goals.csv").then(data => {

  const width = 860,
  height = 600,
  margin = { top: 30, right: 30, bottom: 40, left: 110 };

  const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  data.sort((a, b) => b.Goal_absolute - a.Goal_absolute);

  let x = d3.scaleLinear([0, 60], [margin.left, width - margin.right]);

  let y = d3.scaleBand(data.map(d => (d.City)), [margin.top, height - margin.bottom])
    .padding([0.1]);

  svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`) // move location of axis
      .call(d3.axisBottom(x));
  
  svg.append("g")
    .attr("transform", `translate(${margin.left - 5},0)`)
    .call(d3.axisLeft(y));

  const subgroups = ['UTC', 'Goal_distance'];

  const color = d3.scaleOrdinal(subgroups, ['#196F3D', '#DAF7A6']);

  const stackedData = d3.stack()
    .keys(subgroups)(data)

  console.log(stackedData)
  for (let d of stackedData) {
    console.log(d.key)
  }

  let bar = svg.selectAll(".bar") // create bar groups
    .append("g")
    .data(stackedData)
    .join("g")
    .attr("class", "bar")
    .attr("fill", d => color(d.key));

  bar.selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("x", d => x(d[0]))
    .attr("y", d => y(d.data.City))
    .attr("width", d => x(d[1]) - x(d[0]))
    .attr("height", y.bandwidth());

  // bar.append('text') // add labels
  //   .text(d => d.UTC)
  //   .attr('x', d => x(d.UTC)-10)
  //   .attr('y', d => y(d.City) + (y.bandwidth()/2))
  //   .attr('text-anchor', 'end')
  //   .attr('dominant-baseline', 'middle')
  //   .style('fill', 'white');

  const legend_labels = ["Current Urban Canopy", "City Urban Canopy Goals"]

  let legendGroup = svg
    .selectAll(".legend-group")
    .data(subgroups)
    .join("g")
    .attr("class", "legend-group");

  legendGroup
    .append("circle")
    .attr("cx", (d, i) => (10 + (i * 180)))
    .attr("cy",10)
    .attr("r", 3)
    .attr("fill", (d, i) => color(i));
  
  legendGroup
    .append("text")
    .attr("x", (d, i) => (20 + (i * 180)))
    .attr("y",15)
    .text((d, i) => legend_labels[i]);

  svg.append("text")
    .attr("class", "x-label") // 'x-label' is just random name for this class
    .attr("text-anchor", "end")
    .attr("x", width-margin.right + 10)
    .attr("y", height - 8)
    .text("% Urban Canopy Cover")

  // svg.append("g")
  //   .selectAll("g")
  //   .data(stackedData)
  //   .join("g")
  //   .attr("fill", d => color(d.key))
  //   // .attr("stroke", "white")
  //   // .attr("stroke-width", 2)
  //   .selectAll("rect")
  //   .data(d => d)
  //   .join("rect")
  //   .attr("x", d => x(d[0]))
  //   .attr("y", d => y(d.data.City))
  //   .attr("width", d => x(d[1]) - x(d[0]))
  //   .attr("height", y.bandwidth())
  //   .append('text') // add labels
  //   .text(d => d.data.UTC)
  //   .attr('x', d => x(d.data.UTC)-10)
  //   .attr('y', d => y(d.data.City) + (y.bandwidth()/2))
  //   .attr('text-anchor', 'end')
  //   .attr('dominant-baseline', 'middle')
  //   .style('fill', 'white');

})