// Difference chart of Trees Planted per Year
// https://observablehq.com/@d3/difference-chart

function DifferenceChart(data, {
    x = ([x]) => x, // given d in data, returns the (temporal) x-value
    y1 = () => 0, // given d in data, returns the (quantitative) baseline y-value
    y2 = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    defined, // for gaps in data
    curve = d3.curveLinear, // curve generator for the lines
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 60, // left margin, in pixels
    width = 800, // outer width, in pixels
    height = 600, // outer height, in pixels
    xType = d3.scaleUtc, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
    colors = d3.schemePiYG[3], // colors for negative and positive differences
    stroke = "currentColor", // stroke color of line
    strokeLinecap = "round", // stroke line cap of the line
    strokeLinejoin = "round", // stroke line join of the line
    strokeWidth = 1.5, // stroke width of line, in pixels
    strokeOpacity = 1, // stroke opacity of line
  } = {}) {
    // Compute values.
    const X = d3.map(data, x);
    const Y1 = d3.map(data, y1);
    const Y2 = d3.map(data, y2);
    const I = d3.range(data.length);
    if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y1[i]) && !isNaN(Y2[i]);
    const D = d3.map(data, defined);
 
    // Compute default domains.
    if (xDomain === undefined) xDomain = d3.extent(X);
    if (yDomain === undefined) yDomain = d3.extent([...Y1, ...Y2]);
    
    // Construct scales and axes.
    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 60, yFormat);
  
    // A unique identifier for clip paths (to avoid conflicts).
    const uid = `O-${Math.random().toString(16).slice(2)}`;
  
    // Helpers for rendering lines and areas.
    const line = (y) => d3.line().defined(i => D[i]).curve(curve).x(i => xScale(X[i])).y(y)(I);
    const area = (y0, y1) => d3.area().defined(i => D[i]).curve(curve).x(i => xScale(X[i])).y0(y0).y1(y1)(I);
  
    const svg = d3.select("#diverging-chart")
        .append("svg")
        .attr("viewBox", [0, 0, width, height])
  
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 15)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", height - marginBottom -8)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text("↓ More Trees Destroyed"));;
  
    svg.append("clipPath")
        .attr("id", `${uid}-above`)
      .append("path")
        .attr("d", area(0, i => yScale(Y1[i])));
  
    svg.append("clipPath")
        .attr("id", `${uid}-below`)
      .append("path")
        .attr("d", area(height, i => yScale(Y1[i])));
  
    svg.append("path")
        .attr("clip-path", `url(${new URL(`#${uid}-above`, location)})`)
        .attr("fill", colors[4])
        .attr("d", area(height, i => yScale(Y2[i])));
  
    svg.append("path")
        .attr("clip-path", `url(${new URL(`#${uid}-below`, location)})`)
        .attr("fill", colors[7])
        .attr("d", area(0, i => yScale(Y2[i])));
  
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis.tickFormat(d3.format('.0f')))
        .call(g => g.select(".domain").remove());
  
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-linecap", strokeLinecap)
        .attr("stroke-linejoin", strokeLinejoin)
        .attr("stroke-opacity", strokeOpacity)
        .attr("d", line(i => yScale(Y1[i])));


    // Features of the annotation
    const annotationsRight = [
      {
        note: {
          label: "In 2008 the Ash Borer Beattle was confirmed in Chicago",
          align: "right",
          wrap: 180
        },
        color: ["black"],
        x: xScale(2008),
        y: yScale(0),
        dy: 80,
        dx: -50
      }
    ]
    
    // Add annotation to the chart
    const makeAnnotationsRight = d3.annotation()
      .annotations(annotationsRight)
    svg.append("g")
      .call(makeAnnotationsRight)
   
 
    return svg.node();
  }

d3.csv('data/chicago_net_num_trees.csv').then((data) => {DifferenceChart(data, {
    x: d => d.Year,
    y1: d => d.baseline,
    y2: d => d.Net_Tree_Change,
    yLabel: "↑ More Trees Planted",
    yDomain: [-11500, 7500],
    colors: d3.reverse(d3.schemeRdBu[3]),
    curve: d3.curveStep,
    height: 600,
    marginLeft: 65,
    xType: d3.scaleLinear,
    colors: d3.schemeDark2
  })
})

