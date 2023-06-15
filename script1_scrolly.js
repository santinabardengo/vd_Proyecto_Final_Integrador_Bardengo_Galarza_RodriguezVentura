const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo"];

let main = d3.select("main");
let scrolly = main.select("#scrolly");
let $figure = scrolly.select("figure");
let wChart = 1200
let hChart = wChart * 0.5;
let dataChart = [];
let $step;

let scroller = scrollama();

d3.json("StreamingHistory3.json").then(data=> {
    
    var parseTime = d3.timeParse('%Y-%m-%d %H:%M');
    data.forEach(function(d) {
      d.endTime = parseTime(d.endTime);
    });
  
    var formatMonth = d3.timeFormat('%m');
    data.forEach(function(d) {
    d.mes = parseInt(formatMonth(d.endTime));
    });
  
    let filteredData = data.filter(d => d.mes !== 6)
    dataChart = filteredData;
    // kick things off
    init();
});


function handleStepExit(response) {
    // if ($step) {
    console.count("classed");
    d3.select(response.element).classed("is-active", false);
    // }
}

// scrollama event handlers
function handleStepEnter(response) {
    // console.log(response);
    $step = d3.select(response.element);
  
    // add color to current step only
    // if ($step) {
    $step.classed("is-active", true);
    console.count("classed");
    // }
  
    $step.style("background", "#ff00002e");
  
    // create new chart
    const key = $step.attr("data-step");
  
    // console.log("response.element", response.element);
    // console.log("$step", $step);
    // console.log("key", key);
  
    createChart(key);
  }


function handleStepProgress(response) {
    // console.log(response);
    // $figure.style("opacity", response.progress);
    // $step = d3.select(response.element);
    // console.log($step.attr("data-step"));
    $step.select(".progress").text(d3.format(".1%")(response.progress));
}


function init() {
    // 1. setup the scroller passing options
    // 		this will also initialize trigger observations
    // 2. bind scrollama event handlers (this can be chained like below)
    scroller
      .setup({
        step: "#scrolly article .step",
        offset: 0.33,
        debug: false,
        progress: true,
        order:true,
      })
      .onStepEnter(handleStepEnter)
      .onStepExit(handleStepExit)
      .onStepProgress(handleStepProgress);
  }


/* DataViz */
function createChart(key) {
    console.log(key)
    let chart = Plot.plot({
      width: wChart,
      height: hChart,
      grid: true,
      marginTop: 50,
      marginBottom: 100,
      marginLeft: 50,
      marginRight: 50,
      marks: [
        Plot.axisX({
            label:null,
            tickSize: 0,
            color: 'white',
            fontWeight: 'bold',
            fontSize: 15
          }),
          Plot.axisY({
            label: null,
            tickFormat: d => monthNames[d - 1],
            tickLength: 50,
            tickSize: 0,
            padding: 50,
            fontWeight: 'bold',
          }),
          Plot.text(dataChart, Plot.groupY({x: 'sum'}, {
            y: 'mes',
            x: d => d.msPlayed / 60000,
            text: d => {
              let suma_ms = d3.sum(d, d2 => d2.msPlayed / (60000*60));
              let formattedValue = d3.format('d')(suma_ms);
              return formattedValue + ' hs';
            },
            textAnchor: 'top',
            dx: 25,
            dy: -2,
            fill: 'black',
            fontSize: 12,
            fontWeight: 'bold'
      
          })),

          Plot.barX(dataChart, Plot.groupY({x:"sum"},{
            x: d => d.msPlayed/60000,
            y: 'mes',
            strokeOpacity: 0.4,
            stroke: 'black',
            fill: d => d.mes === parseInt(key) ? 'green' : 'gray',
            //tip: true,
          })),
      ],
    });
  
  
    d3.select("#scrolly figure svg").remove();
    d3.select("#scrolly figure").append(() => chart);
  }
  
