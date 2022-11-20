d3.csv('data/chicago_tree_equity.csv').then(data => {

    let height = 400,
    width = 600,
    margin = ({ top: 20, right: 30, bottom: 35, left: 25 });

    const svg = d3.select("#scatter")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

    const X = d3.map(data, d => +d.tes);
    const Y = d3.map(data, d => +d.trees_planted);
    const C = d3.map(data, d => +d.avg_temp)
    const R = d3.map(data, d => +d.pctpov)

    const xDomain = d3.extent(X)
    const yDomain = d3.extent(Y)

    const color = d3.scaleLinear()
        .domain(d3.extent(C))
        .range(d3.schemeYlGn[6]);

    var wrapper = svg.append("g").attr("class", "chordWrapper")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let xScale = d3.scaleLinear()
        .domain(xDomain).nice()
        .range([margin.left, width - margin.right]);

    let yScale = d3.scaleLinear()
        .domain(yDomain).nice()
        .range([height - margin.bottom, margin.top]);

    wrapper.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .attr("class", "x-axis")
        .call(d3.axisBottom(xScale).tickSize(-height + margin.top + margin.bottom))

    wrapper.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale).tickSize(-width + margin.left + margin.right))

    var circleGroup = wrapper.append("g")
        .attr("class", "circleWrapper"); 


    wrapper.selectAll("communities")
        .data(data.sort(function(a,b) { return b.pctpov > a.pctpov; })) //Sort so the biggest circles are below
        .enter().append("circle")
            .attr("class", "communities")
            .style("opacity", 0.7)
            .style("fill", function(d) {return color(d.avg_temp);})
            .attr("cx", function(d) {return xScale(d.tes);})
            .attr("cy", function(d) {return yScale(d.trees_planted);})
            .attr("r", function(d) {return d.pctpov*10})
            .on("mouseover", showTooltip)
            .on("mouseout", removeTooltip);   
            
    //Hide the tooltip when the mouse moves away
    function removeTooltip() {

        //Fade out the circle to normal opacity
        d3.select(this).style("opacity", 0.7);
        
        //Hide tooltip
        $('.popover').each(function() {
            $(this).remove();
        }); 

    }//function removeTooltip

    //Show the tooltip on the hovered over slice
    function showTooltip(d) {
        console.log(d)
	
        //Define and show the tooltip
        $(this).popover({
            placement: 'auto top',
            container: '#scatter',
            trigger: 'manual',
            html : true,
            content: function() { 
                return "<span style='font-size: 11px; text-align: center;'>" + d.community + "</span>"; }
        });
        $(this).popover('show');

        //Make chosen circle more visible
        d3.select(this).style("opacity", 1);
					
    }//function showTooltip

    //iFrame handler
    // var pymChild = new pym.Child();
    // pymChild.sendHeight()
    // setTimeout(function() { pymChild.sendHeight(); },5000);
    });
