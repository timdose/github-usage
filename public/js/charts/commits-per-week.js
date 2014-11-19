
function drawCommitsPerWeekChart(data) {
    var chartSelector = '#commitsPerWeekChart';

    $(chartSelector).children().remove();

    var commits = [];

    data.repos.forEach(function(repo){
        Array.prototype.push.apply(commits, repo.commits);
    });


    var weeks = d3.nest()
        .key(function(commit){
            var d = new Date(commit.commit.author.date);
            var day = d.getDay();
            var sunday = new Date(d.setDate(d.getDate()-day));
            var month = ('00' + (sunday.getMonth()+1)).substr(-2,2);
            var date = ('00' + sunday.getDate()).substr(-2,2);
            var formatted = [sunday.getFullYear(),month,date].join('-')
            return formatted;
        })
        .rollup(function(values) { return values.length; })
        .entries(commits)
        .map(function(week) {
            return {name:week.key, numCommits: week.values };
        })
        .sort(function(a, b) {
            return new Date(a.name) - new Date(b.name);
        });

    console.log(weeks);

    var maxCommits = d3.max(weeks, function(d){ return +d.numCommits });

    var margin = {
        top: 40,
        right: 30,
        bottom: 50,
        left: 120
    }
    var width = 455 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width])
        .domain([0, maxCommits])

    var y = d3.scale.ordinal()
        .rangeRoundBands([height,0], .1)
        .domain(weeks.map(function(repo) { return repo.name; }));

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
        .attr('transform', function(d) { return 'translate(0,' + ( height - y(d.name)) + ')'})

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

