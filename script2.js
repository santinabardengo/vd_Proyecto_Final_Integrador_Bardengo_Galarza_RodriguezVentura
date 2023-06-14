
// using d3 for convenience
let main = d3.select("main");
let scrolly = main.select("#scrolly");
let $figure = scrolly.select("figure");
let wChart = 1200
let hChart = wChart * 0.5;
let dataChart = [];
let $step;

let scroller = scrollama();

d3.csv('dataset_canciones.csv', d3.autoType).then(data => {
console.log(data)
const canciones = data.map(d => d.cancion);
let chart2 = Plot.plot({
    marks: [
    Plot.text(data, {x: 'cancion', y: 'energy', text: d => d.cancion, 
    textAnchor: 'middle', fontWeight:600,dy:54}),
    Plot.line(data, {x: 'cancion',
    strokeWidth: 8.5,
    strokeOpacity: 0.5,
    stroke:"green",
    marker: "circle",
    r: 4,
    y: 'energy'}),
    Plot.dot(data, Plot.pointer({x: "cancion", y: "energy", fill: "purple", r: 20}))
    ],
    width: 2200,
    height: 900,
    marginLeft: 110,
    marginBottom: 50,
    marginTop: 30,
    y: {
        grid: true,
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
    
    },
    style: {
        fontFamily: 'sans-serif',
        fontSize: 44,
        background: 'white',
    
    },

})

d3.select('#chart2').append(() => chart2)

d3.select("#scrolly figure svg").remove();
d3.select("#scrolly figure").append(() => chart);
})

