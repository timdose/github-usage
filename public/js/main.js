
$(document).ready(function() {
    $('#input').on('submit', function() {
        fetchData($('#user').val());
    });
});


function fetchData(user) {
    $.ajax({
        url: '/api/user/' + user,
        dataType: 'json'
    })
    .done( function( data ) {
        console.log(data);
        drawChart(data);
    })
    .error( function(err) {
        console.log(err);
    });
}


function drawChart(data) {

    var margin = {
        top: 40,
        right: 30,
        bottom: 30,
        left: 40
    }
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0,width], .1)
        .domain(data.map(function(d) { return d.name; }));

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.linear()
        .range([0,90])
        .domain([0, 1])

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .ticks(10, '%')

    var chart = d3.select('#chart')
        .attr('width', width + margin.left + margin.right )
        .attr('height', height + margin.top + margin.bottom )
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    color.domain([0,1])

    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '.71em')
        .style('text-anchor', 'end')
        .text('Frequency')

    var bar = chart.selectAll('.bar')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'bar-group')
        .attr('transform', function(d) { return 'translate(' + x(d.name) + ',0)'})

    bar.append('rect')
        .attr('class', 'bar')
        .attr('y', function(d) { return y(d.value); })
        .attr('fill', function(d) { return d3.lab(color(d.value),0,0) })
        .attr('height', function(d) { return height - y(d.value); })
        .attr('width', x.rangeBand() )
    
    bar.append('text')
        .attr('class', 'test')
        .attr('x', x.rangeBand() /2 )
        .attr('dy', '.75em')
        .attr('y', function(d) { return y(d.value) - 12; })
        .text(function(d) {return d.value * 100 + '%'; })
}