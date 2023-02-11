const plotPenguins = (d) => {

    let tooltipOffsetPx = 10
    const xName = "bill_length_mm"
    const yName = "bill_depth_mm"
    const fillName = "species"
    const width = 1000
    const height = 500
    const margin = 20
    const labelSpace = 30
    // const fill = "#44009966"
    const fillHover = "#220077"

    const x = d => +d[xName]
    const y = d => +d[yName]
    const fill = d => d[fillName]
    const marginTop = margin + labelSpace

    d = d.filter(i => !isNaN(i[xName]) && !isNaN(i[yName]))

    const X = d3.map(d, x)
    const Y = d3.map(d, y)
    const FILL = d3.map(d, fill)

    const xScale = d3.scaleLinear()
        .domain(d3.extent(X))
        .range([0 + margin, width - margin])

    const yScale = d3.scaleLinear()
        .domain(d3.extent(Y))
        .range([height - margin, 0 + marginTop])

    const fillScale = d3.scaleOrdinal()
        .domain([...new Set(FILL)])
        .range(['#cd9600', '#00bfc4', '#00be67'])

    const xAxis = d3.axisTop(xScale)

    const yAxis = d3.axisLeft(yScale)

    console.log({
        d,
        X,
        Y,
        FILL,
        xrange: d3.extent(X),
        xvals: d3.map(X, xScale),
        yvals: d3.map(Y, yScale),
        fillDomain: [...new Set(FILL)]
    })

    let tooltip = d3.select("body")
        .append("div")
        .attr("class", "svg-tooltip")
        .style("visibility", "hidden")
        .style("position", "absolute")

    let svg = d3.select(".chart")
        .append("svg")
        .attr("height", height)
        .attr("width", width)

    svg.append("g")
        .attr("transform", `translate(0,${marginTop})`)
        .call(xAxis)
        .call(g => g.append("text")
                  .attr("x", width - margin)
                  .attr("y", 0 - labelSpace)
                  //.attr("font-size", 16)
                  .attr("fill", "black")
                  .attr("text-anchor", "end")
                  .attr("dominant-baseline", "auto")
                  .html(xName + "→"));

    svg.append("g")
        .attr("transform", `translate(${margin}, 0)`)
        .call(yAxis)
        .call(g => g.append("text")
                  .attr("x", 0)
                  .attr("y", labelSpace)
                  //.attr("font-size", 16)
                  .attr("fill", "black")
                  .attr("text-anchor", "start")
                  .attr("dominant-baseline", "auto")
                  .html("↑" + yName));

    svg.append("g")
        .selectAll("circle")
        .data(d)
        .join("circle")
        .attr("cx", d => xScale(d.bill_length_mm))
        .attr("cy", d => yScale(d.bill_depth_mm))
        .attr("fill", d => fillScale(d[fillName]) + "99")
        .attr("r", 8)
        .on("mouseenter", function (e, d) {
            console.log({ e, d })

            d3.select(this)
                .attr("fill", fillHover)

            d3.select(".svg-tooltip")
                .style("visibility", "visible")
                .html(`Species: ${d.species}`)

            d3.select(".svg-tooltip")
                .style('top', `${e.pageY}px`)
                .style('left', `${e.pageX + tooltipOffsetPx}px`)

        })
        .on("mouseout", function (e, d) {
            console.log({ e, d })
            d3.select(this)
                .transition()
                .duration(200)
                .ease(d3.easeSinOut)
                .attr("fill", d => fillScale(d[fillName]) + "99")

            d3.select(".svg-tooltip")
                .style("visibility", "hidden")
        })

}

function interact(e, d) {
    console.log({ e, d })
    d3.select(this)
        .style("fill", "black")
}

d3.csv('https://raw.githubusercontent.com/allisonhorst/palmerpenguins/main/inst/extdata/penguins.csv').then(
    d => plotPenguins(d)
)