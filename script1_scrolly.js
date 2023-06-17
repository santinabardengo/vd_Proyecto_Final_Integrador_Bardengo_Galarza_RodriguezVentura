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
  
  function findMostListenedSongPerMonth(data) {
    // Creamos un objeto para almacenar la suma de los milisegundos escuchados por canción en cada mes
    let totalListenedTime = {};
  
    // Recorremos los datos y sumamos los milisegundos escuchados por canción en cada mes
    data.forEach(datum => {
      const month = datum.endTime.slice(0, 7);
      const currentTotalTime = totalListenedTime[month] || {};
  
      // Si la canción no está en el objeto totalListenedTime, la agregamos con su tiempo de reproducción
      if (!currentTotalTime[datum.trackName]) {
        currentTotalTime[datum.trackName] = datum.msPlayed / 60000;
      } else {
        // Si la canción ya está en el objeto totalListenedTime, sumamos los milisegundos escuchados
        currentTotalTime[datum.trackName] += datum.msPlayed / 60000;
      }
  
      totalListenedTime[month] = currentTotalTime;
    });
  
    // Recorremos el objeto totalListenedTime para encontrar la canción más escuchada de cada mes
    let mostListenedSongs = {};
    for (let month in totalListenedTime) {
      let maxTime = 0;
      let mostListenedSong = '';
  
      for (let song in totalListenedTime[month]) {
        const time = totalListenedTime[month][song];
        if (time > maxTime) {
          maxTime = time;
          mostListenedSong = song;
        }
      }
  
      mostListenedSongs[month] = {
        song: mostListenedSong,
        plays: maxTime
      };
    }
  
    return mostListenedSongs;
  }
  
  
  // Cargar los datos desde un archivo JSON y generar los gráficos
  d3.json('StreamingHistory3.json').then(data => {
    const mostListenedSongsPerMonth = findMostListenedSongPerMonth(data);
    console.log("Canciones más escuchadas:", mostListenedSongsPerMonth);
  
    createChart(dataFetched, cancion.mes);
    
  });
  

  d3.csv('dataset_canciones.csv', d3.autoType).then(data => {
    console.log(data);
    const canciones = data.map(d => d.cancion);
  
    let chart2 = Plot.plot({
      marks: [
        Plot.text(data, {
          x: 'cancion',
          y: 'energy',
          text: d => d.cancion,
          textAnchor: 'middle',
          fontWeight: 600,
          dy: 54
        }),
        Plot.line(data, {
          x: 'cancion',
          strokeWidth: 8.5,
          strokeOpacity: 0.5,
          stroke: "green",
          marker: "circle",
          r: 4,
          y: 'energy'
        }),
        Plot.dot(data, Plot.pointer({
          x: "cancion",
          y: "energy",
          fill: "purple",
          r: 20
        }))
      ],
      width: 2200,
      height: 900,
      marginLeft: 110,
      marginBottom: 50,
      marginTop: 30,
      y: {
        grid: false,
        label: '',
        labelOffset: 990,
        domain: [0, 1],
        ticks: 5,
      },
      x: {
        type: 'band',
        domain: canciones,
        label: '',
        tickFormat: () => '',
        grid: false,
      },
      style: {
        fontFamily: 'sans-serif',
        fontSize: 44,
        background: 'white',
      }
    });
  
    d3.select('#chart2 svg').remove();
    d3.select('#chart2').append(() => chart2);
  });
  
  