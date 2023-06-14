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
  

function findMostListenedSongPerMonth(data) {
  // Creamos un objeto para almacenar la suma de los milisegundos escuchados por canción en cada mes
  let totalListenedTime = {};

  // Recorremos los datos y sumamos los milisegundos escuchados por canción en cada mes
  data.forEach(datum => {
    const month = datum.endTime.slice(0, 7);
    const currentTotalTime = totalListenedTime[month] || {};

    // Si la canción no está en el objeto totalListenedTime, la agregamos con su tiempo de reproducción
    if (!currentTotalTime[datum.trackName]) {
      currentTotalTime[datum.trackName] = datum.msPlayed/60000;
    } else {
      // Si la canción ya está en el objeto totalListenedTime, sumamos los milisegundos escuchados
      currentTotalTime[datum.trackName] += datum.msPlayed/60000;
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

// Cargar los datos desde un archivo JSON
d3.json('StreamingHistory3.json').then(data => {
  // Llamar a la función findMostListenedSongPerMonth con los datos cargados
  const mostListenedSongsPerMonth = findMostListenedSongPerMonth(data);
  console.log("Canciones mas escuchadas:", mostListenedSongsPerMonth);
});

d3.csv('dataset_canciones.csv', d3.autoType).then(data => {
  console.log(data)
  const canciones = data.map(d => d.cancion);
  
  let chart2 = Plot.plot({
    marks: [
      Plot.text(data, {x: 'cancion', y: 'energy', text: d => d.cancion}),
      Plot.line(data, {x: 'cancion',
      strokeWidth: 2.5,
      strokeOpacity: 0.3,
      marker: "circle",
      r: 3,
      y: 'energy'})
      
    ],
    width: 2200,
      height: 900,
      insetLeft: 40,
      insetRight: 40,
      marginBottom: 50,
      marginTop: 30,
    
      y: {
        grid: true,
        label: '',
        labelOffset: 75,
        domain: [0, 1],
        ticks: 5,
      },

    x: { 
      type: 'band', 
      domain: canciones,
      label: '',
      tickFormat: () => '',
      
      },
      style: {
        fontFamily: 'sans-serif',
        fontSize: 42,
        background: 'white',
        
    
      },

  })
  d3.select('#chart2').append(() => chart2)
})