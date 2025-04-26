function createSVG() {

    const contentHolder = document.getElementById("content-holder");
    contentHolder.innerHTML+= `<div id="svg-holder"></div>`;
    const width = contentHolder.getBoundingClientRect().width;

    const margin = {top: 20, right: 30, bottom: 0, left: 10};
    const height = 700;


    const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", `${height}px`)
      .attr("style", "max-width: 100%; height: auto;");
    svg.append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");


    const svgHolder = document.getElementById("svg-holder");
    svgHolder.append(svg.node());

    var keys = Object.keys(players);
    console.log(keys);
    console.log(players);

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0,players[leaderboard[0][0]].length])
        .range([ 0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height*0.8 + ")")
        .call(d3.axisBottom(x));
        // .select(".domain").remove()
      // Customization
    svg.selectAll(".tick line").attr("stroke", "#b8b8b8")

    // Add X axis label:
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width-100)
      .attr("y", height-70 )
      .text("Round");


    const minMax = getMinMaxScores(players);
    // Add Y axis

    var y= d3.scaleLinear()
        // .domain([-1000,1000])
        .domain([minMax[0], minMax[1]])
        // .domain(d3.extent(allData, function(d) { return d.score}))
        .range([ height, 0 ]);

    // color palette
    // var color = d3.scaleOrdinal()
    //     .domain(keys)
    //     .range(d3.interpolateInferno);

    // var color = d3.scaleOrdinal()
    // .domain(keys)
    // .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf'])


    // var stackedData = d3.stack()
    //     .offset(d3.stackOffsetSilhouette)
    //     .keys(keys)
    //     .value(function(d) {return d.score})
    // (allData);

    // console.log(stackedData);

    // svg.selectAll("mylayers")
    //     .data(stackedData)
    //     .enter()
    //     .append("path")
    //       .style("fill", function(d) { return color(d.key); })
    //       .attr("d", d3.area()
    //         .x(function(d, i) { return x(d.data.date); })
    //         .y0(function(d) { return y(d[0]); })
    //         .y1(function(d) { return y(d[1]); })
    //     );

    // svg.append("rect")
    //     .attr("width","100%").attr("height","100%").attr("fill","black");


    const colors = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf'];
    for (var i = 0 ; i < keys.length ; i++) {
        var myline = d3.line().x((d) => width-d.round*width)
                        .y((d) => d.score)
                        // .curve(d3.curveCardinal);

        // var filtered = Object.fromEntries(Object.entries(allData).filter(([k,v]) => v.player==leaderboard[0][0]));
        // var filtered = filterByPlayer(allData,leaderboard[0][0]);
                        var filtered = filterByPlayer(allData,keys[i]);
        console.log(filtered)
        console.log(filtered);
        console.log(myline);
        console.log(myline(filtered));


        svg.append("path").attr("d",myline(filtered))
                        // .style("fill",colors[i])
                        .style("stroke",colors[i])
                        .style("stroke-width", 1);

    }


    
    
    // svg.append("path")
    //     .attr("class","line")
    //     .attr("d",myline(filtered))
    //     .style("fill","red")
    //     .style("stroke","red")
    //     .style("stroke-width", 2);


}