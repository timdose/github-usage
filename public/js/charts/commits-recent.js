
function drawRecentCommitsChart(commits) {
    var chartSelector = '#recentCommitsChart';
    $(chartSelector).children().remove();


    //--------------------------------------------------------------------
    // Set margins + size
    //--------------------------------------------------------------------
    var margin = {top: 50, right: 50, bottom: 60, left: 60},
    width = 960 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;


    //--------------------------------------------------------------------
    // Set popularity values
    //--------------------------------------------------------------------
    var parseDate = d3.time.format("%Y-%m-%d").parse;


    //--------------------------------------------------------------------
    // Prep some data
    //--------------------------------------------------------------------
    commits.forEach(function(d) {
        d.formattedDate = d.date;
        d.date = parseDate(d.date);
        d.numCommits = +d.numCommits;
    });


    //--------------------------------------------------------------------
    // Create scale functions
    //--------------------------------------------------------------------
    var x = d3.time.scale()
        .range([0, width])
        .domain(d3.extent(commits, function(d) { return d.date; }));

    var y = d3.scale.linear()
        .range([height, 0])
        .domain(d3.extent(commits, function(d) { return d.numCommits; }));


    //--------------------------------------------------------------------
    // Create axis functions
    //--------------------------------------------------------------------
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");


    //--------------------------------------------------------------------
    // Create line function
    //--------------------------------------------------------------------
    var line = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.numCommits); });


    //--------------------------------------------------------------------
    // Initial chart setup
    //--------------------------------------------------------------------
    var chart = d3.select(chartSelector)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    //--------------------------------------------------------------------
    // Draw axes
    //--------------------------------------------------------------------
    chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

    chart.append("g")
    .attr("class", "y axis")
    .call(yAxis)


    //--------------------------------------------------------------------
    // Draw the line
    //--------------------------------------------------------------------
    chart.append("path")
    .datum(commits)
    .attr("class", "graph-line")
    .attr("d", line);
}