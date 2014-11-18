
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
        bottom: 30,
        left: 40
    }
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0,width], .1)
        .domain(weeks.map(function(repo) { return repo.name; }));

    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, maxCommits])

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
        .data(weeks)
        .enter()
        .append('g')
        .attr('class', 'bar-group')
        .attr('transform', function(d) { return 'translate(' + x(d.name) + ',0)'})

    bar.append('rect')
        .attr('class', 'bar')
        .attr('y', function(d) { return y(d.numCommits); })
        .attr('height', function(d) { return height - y(d.numCommits); })
        .attr('width', x.rangeBand() )
    
    bar.append('text')
        .attr('class', 'test')
        .attr('x', x.rangeBand() /2 )
        .attr('dy', '.75em')
        .attr('y', function(d) { return y(d.numCommits) - 12; })
        .text(function(d) {return d.numCommits; })
}
