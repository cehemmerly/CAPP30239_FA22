const tooltip = d3.select("body")
  .append("div")
  .attr("class", "svg-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

const height = 610,
  width = 975;

const svg = d3.select("#map")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]);

Promise.all([
  d3.csv("data/chicago_tree_equity.csv"),
  d3.json("data/chicago.json")
]).then(([data, chicago]) => {
  const dataById = {};

  for (let d of data) {
    d.tes = +d.tes;
    d.community = d.community.toUpperCase();
    dataById[d.community] = d;
  }

  const communities = topojson.feature(chicago, chicago.objects.chicago);
  const mesh = topojson.mesh(chicago, chicago.objects.chicago);

  const projection = d3.geoMercator()
  .fitSize([width, height], mesh);
  const path = d3.geoPath().projection(projection);

  // Quantize evenly breakups domain into range buckets
  const color = d3.scaleQuantize()
  .domain([70, 100]).nice()
  .range(d3.schemeYlGn[6]);

  d3.select("#legend")
    .node()
    .appendChild(
      Legend(
        d3.scaleOrdinal(
          ['<75', '75-79', '80-84', '85-89', '90-94', '95+'],
          d3.schemeYlGn[6]
        ),
        { title: "Tree Equity Score in Chicago Neighborhoods" }
      ));

  svg.append("g")
    .selectAll("path")
    .data(communities.features)
    .join("path")
    .attr("fill", d => (d.properties.community in dataById) ? color(dataById[d.properties.community].tes) : '#ccc')
    .attr("d", path)
    .attr("stroke", "black")
    .on("mousemove", function (event, d) {
      let info = dataById[d.properties.community];
      tooltip
        .style("visibility", "visible")
        .html(`${d.properties.community}<br>Tree Equity Score: ${info.tes.toFixed(0)}%`)
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
      d3.select(this).attr("fill", "grey  ");
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
      d3.select(this).attr("fill", d => (d.properties.community in dataById) ? color(dataById[d.properties.community].tes) : '#ccc');
    });
});