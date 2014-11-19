
function drawCommitsByRepoChart(data) {
    var chartSelector = '#commitsByRepoChart';

    $(chartSelector).children().remove();

    var repos = data.repos.map(function(repo){
        return { 
            name:repo.name, 
            numCommits: repo.numCommits,
            popularity: repo.watchers_count + repo.stargazers_count + repo.forks_count
        }
    })
    .filter(function(repo) {
        return repo.numCommits > 0;
    });

    var maxCommits = d3.max(repos, function(d){ return +d.numCommits });
    var reallyPopular = 1000;

    var margin = {
        top: 20,
        right: 30,
        bottom: 40,
        left: 150
    }
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width])
        .domain([0, maxCommits])

    var y = d3.scale.ordinal()
        .rangeRoundBands([height,0], .1)
        .domain(repos.map(function(repo) { return repo.name; }));

    var color = d3.scale.linear()
        .domain([0, reallyPopular])
        // .domain([0,reallyPopular])
        // .interpolate(d3.interpolateHsl)
        .interpolate(d3.interpolateLab)
        .range(['hsl(210,30%,60%)', '#f00'])
        // .range(['#000000', '#ffffff'])

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
        .attr('x', (width/2))
        .attr('dy', '.71em')
        .text('# Commits')

    chart.append('g')
        .attr('class', 'y axis')
        .call(yAxis)
        

    var bar = chart.selectAll('.bar-group')
        .data(repos)
        .enter()
        .append('g')
        .attr('class', 'bar-group')
        .attr('transform', function(d) { return 'translate(0,' + (height-y(d.name)) + ')'})

    bar.append('rect')
        .attr('class', 'bar')
        .attr('y', 0 - y.rangeBand() )
        .attr('height', y.rangeBand() )
        .attr('width', function(d) { return x(d.numCommits) } )
        .attr('fill', function(d) { return color(d.popularity); })
    
    bar.append('text')
        .attr('class', 'amount')
        .attr('y', 0-y.rangeBand()/2 )
        .attr('dy', '.25em')
        .attr('x', function(d) { return x(d.numCommits) + 5 } )
        .text(function(d) {return d.numCommits; })
}

