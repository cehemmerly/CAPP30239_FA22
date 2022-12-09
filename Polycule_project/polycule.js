d3.json('polycule.json').then(data => {
  let height = 600,
    width = d3.select("#chart").style("width").slice(0, -2);

  const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  let { nodes, links } = data;
  console.log(nodes, links)

  const radius = 25;

  let simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink()
      .id(d => d.name)
      .links(links)
      .distance(100)
    )
    // .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(radius + 10));

  let drag = d3.drag()
    .on("start", event => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    })
    .on("drag", event => {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    })
    .on("end", event => {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    });

  // let text = svg.selectAll("image")
  //   .data(nodes)

  // text.enter().append("text")
  //   .attr("class", "label")
  //   .attr("fill", "black")
  //   // .attr('width', imgSize)
  //   // .attr('height', imgSize)
  //   .text(d => d.name)
  //   // .merge(text)
  //   // .attr("x", d => d.x)
  //   // .attr("y", d => d.y);

  simulation.on("tick", () => {
    let link = svg
      .selectAll("line")
      .data(links);

    link
      .enter()
      .append("line")
      .style("stroke", "#aaa")
      .attr("stroke-width", 1.5)
      .merge(link)
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)

    let node = svg
      .selectAll("circle")
      .data(nodes);

    node
      .enter()
      .append("circle")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("r", radius)
      .attr("fill", (d) => d.color)
      .call(drag)
      .merge(node)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      

    node.append("title")
      .text(d => d.name);
    
    node.append("text")
      .attr("y", 4)
      .attr("x", -15)
      .text(d => d.name)

    // text.attr("transform", function(d) {
    //     return "translate(" + d.x + "," + d.y + ")";
    //   });

    // let img = svg
    //   .selectAll("image")
    //   .data(nodes);

    // img.enter()
    //   .append("svg:image")
    //   // .text("")
    //   // .attr('width', imgSize)
    //   // .attr('height', imgSize)
    //   .attr("text")
    //   .merge(img)
    //   .attr("x", d => d.x)
    //   .attr("y", d => d.y)
    //   .text(d => d.name)

    // const imgSize = radius;
    // const halfImgSize = imgSize / 2;

    // let text = svg.selectAll("image")
    //   .data(nodes)

    // text.enter().append("text")
    //   .attr("class", "label")
    //   .attr("fill", "black")
    //   .attr('width', imgSize)
    //   .attr('height', imgSize)
    //   .text(d => d.name)
    //   .merge(text)
    //   .attr("x", d => d.x - halfImgSize)
    //   .attr("y", d => d.y - halfImgSize);


    // svg.append("text")
    //   .data(nodes)
    //   .attr("class", "x-label")
    //   .attr("text-anchor", "end")
    //   .attr("x", d => d.x)
    //   .attr("y", d => d.y)
    //   .attr("dx", "0.5em")
    //   .attr("dy", "-0.5em") 
    //   .text("Year");

  });

});