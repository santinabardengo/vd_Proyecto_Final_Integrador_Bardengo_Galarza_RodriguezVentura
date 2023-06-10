// const locale = {
//     decimal: ',',
//     thousands: '.',
//     grouping: [3],
//   }
//   d3.formatDefaultLocale(locale)
  
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
    dataFetched = data
    $sliderMinutos.attr('value', usuario.minutos)
    $minutosP.text(usuario.minutos)

    createChart(dataFetched)
    registerListenerInput()
  })


function registerListenerInput() {
    $sliderMinutos.on('input', event => {
      usuario.minutos = event.target.value
      $minutosP.text(event.target.value)
      createChart(dataFetched)
    })
}

function createChart(data) {
    /* Agregamos al usuario */
    data = data.concat(usuario)
    // console.table(data)
  
    chart = Plot.plot({
      grid: true,
      nice: true,
  
      marks: [
        Plot.dot(data, {
          x: 'peso',
          y: d => d.altura / 100,
          strokeOpacity: 0.3,
          stroke: 'black',
        }),
        Plot.dot(data, {
          x: 'peso',
          filter: d => d.nombre == 'Usuario',
          y: d => d.altura / 100,
          fill: '#0060df',
          r: 10,
        }),
      ],
      x: {
        label: 'Peso (kg)',
        // ticks: 5,
      },
      y: {
        label: 'Altura (m)',
        tickFormat: '.2f',
      },
    })
  
    /* Remueve el chart viejo */
    d3.select('#chart svg').remove()
  
    /* Crea el chart nuevo */
    d3.select('#chart').append(() => chart)
  }
  