
function drawRecentCommitsChart(commits) {
    var chartSelector = '#recentCommitsChart';
    $(chartSelector).children().remove();

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y-%m-%d").parse;

    commits.forEach(function(d) {
        d.formattedDate = d.date;
        d.date = parseDate(d.date);
        d.numCommits = +d.numCommits;
    });

    var x = d3.time.scale()
        .range([0, width])
        .domain(d3.extent(commits, function(d) { return d.date; }));

    var y = d3.scale.linear()
        .range([height, 0])
        .domain(d3.extent(commits, function(d) { return d.numCommits; }));

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        // .x(function(d) { 
        //     console.log(d, x(d.date));
        //     return x(d.date); 
        // })
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.numCommits); });

    var chart = d3.select(chartSelector)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    chart.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    // .append("text")
    // .attr("transform", "rotate(-90)")
    // .attr("y", 6)
    // .attr("dy", ".71em")
    // .style("text-anchor", "end")
    // .text("Price ($)");

    chart.append("path")
    .datum(commits)
    .attr("class", "graph-line")
    .attr("d", line);
}