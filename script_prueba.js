
Plot.plot({
    grid: true,
    marks: [
      Plot.dot(olympians, {
        x: "weight",
        y: "height",
        fy: "sex",
        sort: (d) => !!d.info,
        stroke: (d) => d.info ? "currentColor" : "#aaa"
      }),
      Plot.tip(olympians, Plot.pointer({
        x: "weight",
        y: "height",
        fy: "sex",
        filter: (d) => d.info,
        title: (d) => [d.name, d.info].join("\n\n")
      }))
    ]
  })