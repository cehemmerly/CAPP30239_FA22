const tooltip2 = d3.select("body")
  .append("div")
  .attr("class", "svg-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

Promise.all([
  d3.csv("data/tes.csv"),
  d3.json("data/counties-albers-10m.json")
]).then(([data, us]) => {

  const svg = d3.select("#bubble-map")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

  const dataById = {};
  for (let d of data) {
    d['Tree Equity Score'] = +d['Tree Equity Score'];
    d['Population'] = +d['Population'];
    dataById[d.county_id] = d;
  }

  const radius = d3.scaleLinear()
    .domain(d3.extent(Object.values(data), d => d["Population"]))
    .range([15, 30]);

  const path = d3.geoPath()

  const counties = topojson.feature(us, us.objects.counties);
  const states = topojson.feature(us, us.objects.states)

  let locations = []
  for (let i in dataById) {
    let result = counties.features.find(item => item.id === i)
    locations.push(result)
  }

  const color = d3.scaleQuantize()
    .domain([70, 95]).nice()
    .range(d3.schemeYlGn[8]);

  svg.append("g")
    .selectAll("path")
    .data(states.features)
    .join("path")
    .attr("stroke", '#ccc')
    .attr("fill", "#efefef")
    .attr("d", path)

  svg.append("g")
    .selectAll("circle")
    .data(locations)
    .join("circle")
    .attr("stroke", '#ccc')
    .attr("fill", d => color(dataById[d.id]['Tree Equity Score']))
    .attr("opacity", 0.75)
    .attr("r", d => radius(dataById[d.id]['Population']))
    .attr("transform", d => `translate(${path.centroid(d)})`)
    .on("mousemove", function (event, d) {
      let city = dataById[d.id].City;
      let tes = dataById[d.id]['Tree Equity Score'];
      let pop = dataById[d.id]['Population'];

      tooltip2
        .style("visibility", "visible")
        .html(`${city}<br>TES: ${tes}<br>Population: ${pop}`)
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
      d3.select(this).attr("fill", "grey");
    })
    .on("mouseout", function () {
      tooltip2.style("visibility", "hidden");
      d3.select(this).attr("fill", d => color(dataById[d.id]['Tree Equity Score']));
    });

  svg.append('text') // add labels
    .text(d => d.UTC)
    .attr('x', d => x(d.UTC)-10)
    .attr('y', d => y(d.City) + (y.bandwidth()/2))
    .attr('text-anchor', 'end')
    .attr('dominant-baseline', 'middle')
    .style('fill', d => d.City == 'Chicago' ? "white" : "black");

});