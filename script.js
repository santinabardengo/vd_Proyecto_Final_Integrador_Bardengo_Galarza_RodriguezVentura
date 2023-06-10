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
    minutos: 0,
    nombre: 'Cancion',
  }
  
  /* Selected elements */
  let $sliderMinutos = d3.select('#msPlayed')
  let $minutosP = d3.select('#value-minutos')
//   let $sliderAltura = d3.select('#altura')
//   let $alturaP = d3.select('#value-altura')
  
d3.json('StreamingHistory3.json').then(data => {
    var parseTime = d3.timeParse('%Y-%m-%d %H:%M');
    data.forEach(function(d) {
      d.endTime = parseTime(d.endTime);
    });
  
    var formatMonth = d3.timeFormat('%m');
    data.forEach(function(d) {
      d.mes = formatMonth(d.endTime);
    });
  
   console.log(data)

    dataFetched = data
    $sliderMinutos.attr('value', cancion.minutos)
    $minutosP.text(cancion.minutos)

    createChart(dataFetched)
    registerListenerInput()
  });


function registerListenerInput() {
    $sliderMinutos.on('input', event => {
      cancion.minutos = event.target.value
      $minutosP.text(event.target.value)
      createChart(dataFetched)
    })
}

function createChart(data) {
    /* Agregamos al usuario */
    data = data.concat(cancion)
    // console.table(data)
  
    chart = Plot.plot({
      grid: true,
      nice: true,
  
      marks: [
        Plot.barY(data, Plot.groupX({y:"sum"},{
          x: "mes",
          y: d => d.msPlayed/ 60000,
          strokeOpacity: 0.3,
          stroke: 'black',
        })),
      ],
      x: {
        label: 'Mes',
        // ticks: 5,
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
  