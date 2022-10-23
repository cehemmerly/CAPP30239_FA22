/* D3 Line Chart */

const height = 500, //define dimensions of the chart
    width = 800,
    margin = ({ top: 15, right: 30, bottom: 35, left: 40 });
    
const svg = d3.select("#chart") //target div with id = chart
    .append("svg")
    .attr("viewBox", [0, 0, width, height]); //add viewbox to resize based on screen size

d3.csv('long-term-interest-canada.csv').then(data => {
    let timeParse = d3.timeParse("%Y-%m"); //define conversion of string to date

    for (let d of data) {
        d.Date = timeParse(d.Month); //convert string in column 'Month' to date and assign column name 'Date'
        d.Num = +d.Num; //conver strin in column 'Num' to integer
      }
    
    let x = d3.scaleTime() //defines x as a date scale based on the 'Date' column of the data
    .domain(d3.extent(data, d => d.Date))
    .range([margin.left, width - margin.right]);

    let y = d3.scaleLinear() //defines y as a continous scale based on the 'Num' column of the data
    .domain(d3.extent(data, d => d.Num))
    .range([height - margin.bottom, margin.top]);

    svg.append("g") //creates a visual component for x-axis based on the x scale defined above
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));
    
    svg.append("g") //creates a visual component for y-axis based on the y scale defined above
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    let line = d3.line() //create line object with position defined by x and y scale
    .x(d => x(d.Date))
    .y(d => y(d.Num));

    svg.append("path") //create visual component for the line object
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#bbb")
    .attr("d", line)

    svg.append("text") //add label to the x-axis
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", width - margin.right)
      .attr("y", height)
      .attr("dx", "0.5em")
      .attr("dy", "-0.5em") 
      .text("Month");
    
    svg.append("text") //add label to the y-axis
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("x", -margin.top/2)
      .attr("dx", "-0.5em")
      .attr("y", 10)
      .attr("transform", "rotate(-90)")
      .text("Interest rate");
  });