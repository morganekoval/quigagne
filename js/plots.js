// const colors = ["#1b70fc", "#faff16", "#d50527", "#158940", "#f898fd", "#24c9d7", "#cb9b64", "#866888", "#22e67a", "#e509ae", "#9dabfa", "#437e8a", "#b21bff", "#ff7b91", "#94aa05", "#ac5906", "#82a68d", "#fe6616", "#7a7352", "#f9bc0f", "#b65d66", "#07a2e6", "#c091ae", "#8a91a7", "#88fc07", "#ea42fe", "#9e8010", "#10b437", "#c281fe", "#f92b75", "#07c99d", "#a946aa", "#bfd544", "#16977e", "#ff6ac8", "#a88178", "#5776a9", "#678007", "#fa9316", "#85c070", "#6aa2a9", "#989e5d", "#fe9169", "#cd714a", "#6ed014", "#c5639c", "#c23271", "#698ffc", "#678275", "#c5a121", "#a978ba", "#ee534e", "#d24506", "#59c3fa", "#ca7b0a", "#6f7385", "#9a634a", "#48aa6f", "#ad9ad0", "#d7908c", "#6a8a53", "#8c46fc", "#8f5ab8", "#fd1105", "#7ea7cf", "#d77cd1", "#a9804b", "#0688b4", "#6a9f3e", "#ee8fba", "#a67389", "#9e8cfe", "#bd443c", "#6d63ff", "#d110d5", "#798cc3", "#df5f83", "#b1b853", "#bb59d8", "#1d960c", "#867ba8", "#18acc9", "#25b3a7", "#f3db1d", "#938c6d", "#936a24", "#a964fb", "#92e460", "#a05787", "#9c87a0", "#20c773", "#8b696d", "#78762d", "#e154c6", "#40835f", "#d73656", "#1afd5c", "#c4f546", "#3d88d8", "#bd3896", "#1397a3", "#f940a5", "#66aeff", "#d097e7", "#fe6ef9", "#d86507", "#8b900a", "#d47270", "#e8ac48", "#cf7c97", "#cebb11", "#718a90", "#e78139", "#ff7463", "#bea1fd"];
// const colors = d3.scaleSequential().domain([0,keys.length-1])
//         .interpolator(d3.interpolateInferno);

const margin = {top: 20, right: 30, bottom: 0, left: 10};
const height = (window.innerHeight*0.8)-margin.top-margin.bottom;
const width = document.getElementById("content-holder").getBoundingClientRect().width-margin.left-margin.right;
// const height = window.innerHeight*0.8;
// const width = document.getElementById("content-holder").getBoundingClientRect().width;

function createSVGTotalPlot() {

    // const contentHolder = document.getElementById("content-holder");
    // contentHolder.innerHTML+= `<div id="svg-holder"></div>`;
    

    // const margin = {top: 20, right: 30, bottom: 0, left: 10};
    // const height = window.innerHeight*0.8;
    // const width = contentHolder.getBoundingClientRect().width-margin.left-margin.right;

    const svgHolder = document.getElementById("svg-holder");
    svgHolder.classList.remove("invisible");


    const svg = d3.create("svg")
        // .attr("width", width)
        // .attr("height", height)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("style", "max-width: 100%; max-height: 100%;");
    // svg.append("g")
    // svg.attr("transform","translate(" + margin.left + "," + margin.top + ")");


    var allDates = [];
    for (var i = 0 ; i < LDATA.length ; i++) {
        allDates.push(LDATA[i]["date"]);
    }

    var dropdownText = `<select class="dropdown" id="choosedate" name="date"><option value="0">total</option>`;
    for (var i = 0; i < allDates.length ; i++) {
        dropdownText += `<option value="${i+1}">${allDates[i]}</option>`;
    }
    dropdownText += "</select>";

    svgHolder.innerHTML += dropdownText;

    // svgHolder.innerHTML += `<div class="plotOptions">${dropdownText}<span><input type="checkbox" id="detailed-option" name="detailed-option" value="détaillé" onclick="detailedPlot()"/><label for="detailed-option">détaillé</label></span></div>`;

    document.getElementById("choosedate").addEventListener("change", function(event){
        // console.log(event.target.value);
        const indexDate = parseInt(event.target.value);
        if (indexDate == 0) {
            allData = res[0];
            players = res[1];
        } else {
            const test = treatDataDate(indexDate-1);
            allData = test[0];
            players = test[1];
        }
        // console.log(players);
        d3.select("svg").selectAll("*").remove();
        plotScoreEvolution(d3.select("svg"));
    });


    svgHolder.append(svg.node());

   

    // console.log(players);
    
    plotScoreEvolution(svg);

}

function detailedPlot() {}


function plotScoreEvolution(svg,data=allData) {

    console.log(players);
    var keys = Object.keys(players);
    // console.log(keys);

    var tickval = [];
    for (var i = 1 ; i < players[keys[0]].length ; i++) {
        tickval.push(i);
    }

    var x = d3.scaleLinear()
        .domain([0,players[keys[0]].length])
        .range([ 0, width]);
    



    const minMax = getMinMaxScores(players);

    var y= d3.scaleLinear()
        .domain([minMax[0]-100, minMax[1]+100])
        .range([ height-margin.bottom, margin.top ]);


    svg.append("line")
        .style("stroke", "black")
        .style("stroke-width", 1)
        .attr("stroke-dasharray", 1.5)
        .attr("x1", x(0))
        .attr("y1", y(0))
        .attr("x2", width)
        .attr("y2", y(0)); 

    for (var i = 0 ; i < keys.length ; i++) {
        console.log(colorsFor[keys[i]]);
        var myline = d3.line()
                        .x((d) => x(d.round))
                        .y((d) => y(d.score))
                        .curve(d3.curveCardinal.tension(0));

        var filtered = filterByPlayer(data,keys[i]);

        console.log(filtered);
        const path = svg.append("path").attr("d",myline(filtered))
                                        .attr("id",`line-${keys[i]}`)
                                        .attr("class",`${isToggled(keys[i])}`)
                                        .style("fill","none")
                                        .style("stroke",colorsFor[keys[i]])
                                        .style("stroke-width", 2);

        const totalLength = path.node().getTotalLength();

        path.attr("stroke-dasharray", totalLength + " " + totalLength)
              .attr("stroke-dashoffset", totalLength)
              .transition()
                .duration(3000)
                // .ease("linear")
                .attr("stroke-dashoffset", 0);


        svg.append("text")
               .append("textPath") //append a textPath to the text element
               .attr("id",`line-text-${keys[i]}`)
               .attr("class",`${isToggled(keys[i])}`)
               .attr("class","line-text-player")
               .style("fill",colorsFor[keys[i]])
                .attr("xlink:href", `#line-${keys[i]}`) //place the ID of the path here
                .style("text-anchor","middle") //place the text halfway on the arc
                .attr("startOffset", `-50%`)
                .text(keys[i]);

        document.getElementById(`line-${keys[i]}`).addEventListener("mouseover", function(event){
            const playerName = event.srcElement.getAttribute("id").replace("line-","");

            // svg.append("text")
            //    .append("textPath") //append a textPath to the text element
            //    .attr("id",`line-text-${playerName}`)
            //    .attr("class","line-text-player")
            //    .style("fill",colors[keys.indexOf(playerName)])
            //     .attr("xlink:href", `#${event.srcElement.getAttribute("id")}`) //place the ID of the path here
            //     .style("text-anchor","middle") //place the text halfway on the arc
            //     .attr("startOffset", `${event.offsetX/width*100}%`)
            //     .text(playerName);

            const oldOffset = parseInt(document.getElementById(`line-text-${playerName}`).getAttribute("startOffset").replace("%",""));
            d3.select(`#line-text-${playerName}`)
                .transition()
                    .duration(`${Math.abs((event.offsetX/width*100)-oldOffset)/100*500}`)
                    .attr("startOffset",`${event.offsetX/width*100}%`);
        });

        document.getElementById(`line-${keys[i]}`).addEventListener("mouseleave", function(event){
            // const playerName = event.srcElement.getAttribute("id").replace("line-","");
            // setTimeout(() => d3.select(`#line-text-${playerName}`).remove(), 500);


        });


    }

}
