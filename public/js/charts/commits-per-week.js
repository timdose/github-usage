
function drawCommitsPerWeekChart(weeks) {
    var chartSelector = '#commitsPerWeekChart';

    $(chartSelector).children().remove();

    

    var maxCommits = d3.max(weeks, function(d){ return +d.numCommits });

    var margin = {
        top: 50,
        right: 50,
        bottom: 100,
        left: 120
    }
    var width = 455 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width])
        .domain([0, maxCommits])

    var y = d3.scale.ordinal()
        .rangeRoundBands([height,0], .1)
        .domain(weeks.map(function(week) { return week.date; }));

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')


    var chart = d3.select(chartSelector)
        .attr('width', width + margin.left + margin.right )
        .attr('height', height + margin.top + margin.bottom )
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis)
        .append('text')
        .attr('y', 30 )
        .attr('x', width/2)
        .attr('dy', '.71em')
        .style('text-anchor', 'middle')
        .text('# Commits')

    chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        
    var bar = chart.selectAll('.bar-group')
        .data(weeks)
        .enter()
        .append('g')
        .attr('class', 'bar-group')
        .attr('transform', function(d) { return 'translate(0,' + ( height - y(d.date)) + ')'})

    bar.append('rect')
        .attr('class', 'bar-default')
        .attr('width', 20)
        .attr('height', y.rangeBand() )
        .attr('y', 0 - y.rangeBand() )
        .attr('width', function(d) { return x(d.numCommits) } )
    
    bar.append('text')
        .attr('class', 'amount')
        .attr('y', - y.rangeBand() /2 )
        .attr('dy', '.25em')
        .attr('x', function(d) { return x(d.numCommits) + 5; })
        .text(function(d) {return d.numCommits; })
}

