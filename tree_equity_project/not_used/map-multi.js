const tooltip = d3.select("body")
  .append("div")
  .attr("class", "svg-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");

const height = 610,
  width = 975;

let communities;
let mesh;

const color1 = d3.scaleQuantize()
.domain([70, 100]).nice()
.range(d3.schemeYlGn[6]);

const color2 = d3.scaleQuantize()
.domain([0, 24]).nice()
.range(d3.schemeYlGn[6]);

const str1 = 'Tree Equity Score'
const str2 = 'Trees Planted per Mile'

Promise.all([
    // d3.csv("data/chicago_trees_planted.csv"),
    d3.csv("data/chicago_tree_equity.csv"),
    d3.json("data/chicago.json")
  ]).then(([plantings, equity, chicago]) => {
    communities = topojson.feature(chicago, chicago.objects.chicago);
    mesh = topojson.mesh(chicago, chicago.objects.chicago);
    createChart(equity, 'tes', 'map1', color1, str1);
    createChart(plantings, 'trees_planted', 'map2', color2, str2);
  });
  
  
function createChart(data, datafill, elemId, color, str) {
  const dataById = {};

  for (let d of data) {
    d[datafill] = +d[datafill];
    d.community = d.community.toUpperCase();
    //making a lookup table from the array 
    dataById[d.community] = d;
  }

  const projection = d3.geoMercator()
    .fitSize([width, height], mesh);
  const path = d3.geoPath().projection(projection);

  const svg = d3.select(`#${elemId}`)
    .append("div")
    .attr("class", "chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  svg.append("g")
    .selectAll("path")
    .data(communities.features)
    .join("path")
    .attr("fill", d => (d.properties.community in dataById) ? color(dataById[d.properties.community][datafill]) : '#ccc')
    .attr("d", path)
    .attr("stroke", "black")
    .on("mousemove", function (event, d) {
      let info = dataById[d.properties.community];
      tooltip
        .style("visibility", "visible")
        .html(`${d.properties.community}<br>${str}: ${info[datafill].toFixed(0)}`)
        .style("top", (event.pageY - 10) + "px")
        .style("left", (event.pageX + 10) + "px");
      d3.select(this).attr("fill", "grey");
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
      d3.select(this).attr("fill", d => (d.properties.community in dataById) ? color(dataById[d.properties.community][datafill]) : '#ccc');
    })}


d3.select(`#legend-map1`)
    .node()
    .appendChild(
      Legend(
        d3.scaleOrdinal(
          ['<75', '75-79', '80-84', '85-89', '90-94', '95+'],
          d3.schemeYlGn[6]
        ),
        { title: "Tree Equity Score in Chicago Neighborhoods" }
      ));

d3.select(`#legend-map2`)
    .node()
    .appendChild(
      Legend(
        d3.scaleOrdinal(
          ['<4', '4-7', '8-11', '12-15', '16-19', '20+'],
          d3.schemeYlGn[6]
        ),
        { title: "Trees Planted per Street Mile 2011-2021" }
      ));
