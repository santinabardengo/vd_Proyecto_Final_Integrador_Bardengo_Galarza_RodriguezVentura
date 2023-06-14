const locale = {
  decimal: ',',
  thousands: '.',
  grouping: [3],
}
d3.formatDefaultLocale(locale)

/* Var. globales */
let chart
let dataFetched = []
const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"
];


d3.json('StreamingHistory3.json').then(data => {
  
  var parseTime = d3.timeParse('%Y-%m-%d %H:%M');
  data.forEach(function(d) {
    d.endTime = parseTime(d.endTime);
  });

  var formatMonth = d3.timeFormat('%m');
  data.forEach(function(d) {
  d.mes = parseInt(formatMonth(d.endTime));
  });

  let filteredData = data.filter(d => d.mes !== 6)
  dataFetched = filteredData

  createChart(dataFetched)
});


function createChart(data) {
  console.log(data)
  chart = Plot.plot({
    nice: true,
    marks: [
      Plot.barX(data, Plot.groupY({x:"sum"},{
        x: d => d.msPlayed/60000,
        y: 'mes',
        strokeOpacity: 0.4,
        stroke: 'black',
        fill: '#B3B3B3',
        //tip: true,
      })),
      
      Plot.text(data, Plot.groupY({x: 'sum'}, {
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
      Plot.axisX({
        label:null,
        tickSize: 0,
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15
      }),
      Plot.tip(data, Plot.groupY({
        x: d => d.msPlayed / 60000,
        y: "mes",
        //filter: (d) => d.info,
        title: (d) => [d.mes].join("\n\n")
      })),

      Plot.axisY({
        label: null,
        tickFormat: d => monthNames[d - 1],
        tickLength: 50,  
        tickSize: 0,
        padding: 50,       
        fontWeight: 'bold',
     
      }),
    ],
    
    width: 800,
    height: 300,
    marginLeft: 50,
    marginRight: 100,
    marginBottom: 50,
    
  })

  /* Remueve el chart viejo */
  d3.select('#chart svg').remove()

  /* Crea el chart nuevo */
  d3.select('#chart').append(() => chart)
}
