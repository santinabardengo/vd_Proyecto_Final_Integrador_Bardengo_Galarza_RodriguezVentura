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
          strokeOpacity: 0.3,
          stroke: 'black',
          fill: d => (d.mes == selectedMes) ? 'blue' : 'gray'
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
        tickFormat: '.2f',
      },
    })
  
    /* Remueve el chart viejo */
    d3.select('#chart svg').remove()
  
    /* Crea el chart nuevo */
    d3.select('#chart').append(() => chart)
  }
  