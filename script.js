const locale = {
    decimal: ',',
    thousands: '.',
    grouping: [3],
  }
  d3.formatDefaultLocale(locale)
  
  /* Var. globales */
  let chart
  let dataFetched = []
  let cancion = {
    mes: 1,
    trackName: 'Cancion',
  }
  
  /* Selected elements */
  let $sliderMes = d3.select('#mes')
  let $mesP = d3.select('#value-mes')
//   let $sliderAltura = d3.select('#altura')
//   let $alturaP = d3.select('#value-altura')
  
d3.json('StreamingHistory3.json').then(data => {
    dataFetched = data
    
    var parseTime = d3.timeParse('%Y-%m-%d %H:%M');
    data.forEach(function(d) {
      d.endTime = parseTime(d.endTime);
    });
  
    var formatMonth = d3.timeFormat('%m');
    data.forEach(function(d) {
    d.mes = parseInt(formatMonth(d.endTime));
    });
  
  
    $sliderMes.attr('value', cancion.mes)
    $mesP.text(cancion.mes)

    createChart(dataFetched, cancion.mes)
    registerListenerInput()
  });


function registerListenerInput() {
    $sliderMes.on('input', event => {
    let selectedMes = event.target.value;
    cancion.mes = selectedMes;
    $mesP.text(selectedMes);
    createChart(dataFetched, selectedMes);
  });
}

function createChart(data, selectedMes) {
    /* Agregamos la cancion */
    //data = data.concat(cancion)
    //console.table(data)
    console.log(data)
    chart = Plot.plot({
      nice: true,
      marks: [
        Plot.barY(data, Plot.groupX({y:"sum"},{
          x: "mes",
          y: d => d.msPlayed/60000,
          strokeOpacity: 0.4,
          stroke: 'black',
          fill: d => (d.mes == selectedMes) ? 'green' : 'gray'
        })),
        // Plot.dot(data, {
        //     x: 'mes',
        //     filter: d => d.trackName == 'Cancion',
        //     y: d => d.msPlayed /60000,
        //     fill: '#0060df',
        //     r: 10,
        // }),
        
      ],
      x: {
        label: 'Mes',
        //ticks: 6,
      },
      y: {
        label: 'Minutos escuchados',
        //tickFormat: '.2f',
      },
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
    width: 1100,
      height: 700,
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
        fontSize: 20,
        background: 'white',
        
    
      },

  })
  d3.select('#chart2').append(() => chart2)
})