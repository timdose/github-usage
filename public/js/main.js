
$(document).ready(function() {
    $('#input').on('submit', function(event) {
        fetchData($('#user').val());
        event.preventDefault();
    });

    $('#input button').click();
});


function fetchData(user) {
    $.ajax({
        url: '/api/user/' + user,
        dataType: 'json'
    })
    .done( function( data ) {
        drawCommitsByRepoChart(data);
    })
    .error( function(err) {
        console.log(err);
    });
}


function drawCommitsByRepoChart(data) {
    var repos = data.repos.map(function(repo){
        return {name:repo.name, numCommits: repo.numCommits}
    });

    var maxCommits = d3.max(repos, function(d){ return +d.numCommits });

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
        .domain(repos.map(function(repo) { return repo.name; }));

    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, maxCommits])

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')

    var chart = d3.select('#chart')
        .attr('width', width + margin.left + margin.right )
        .attr('height', height + margin.top + margin.bottom )
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')
        .call(xAxis);

    chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -35 )
        .attr('x', 0- (height/2))
        .attr('dy', '.71em')
        .style('text-anchor', 'middle')
        .text('# Commits')

    var bar = chart.selectAll('.bar-group')
        .data(repos)
        .enter()
        .append('g')
        .attr('class', 'bar-group')
        .attr('transform', function(d) { return 'translate(' + x(d.name) + ',0)'})

    bar.append('rect')
        .attr('class', 'bar')
        .attr('y', function(d) { console.log(d); return y(d.numCommits); })
        .attr('height', function(d) { return height - y(d.numCommits); })
        .attr('width', x.rangeBand() )
    
    bar.append('text')
        .attr('class', 'test')
        .attr('x', x.rangeBand() /2 )
        .attr('dy', '.75em')
        .attr('y', function(d) { return y(d.numCommits) - 12; })
        .text(function(d) {return d.numCommits; })
}

