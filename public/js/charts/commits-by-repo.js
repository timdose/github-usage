
function drawCommitsByRepoChart(repos) {
    var chartSelector = '#commitsByRepoChart';

    $(chartSelector).children().remove(); // Probably some d3 way of doing this


    //--------------------------------------------------------------------
    // Set popularity values
    //--------------------------------------------------------------------
    var popularityScale = [
        {title:'Low', range: '0-199', value:0},
        {title:'Medium', range: '200-499', value:200},
        {title:'High', range: '500-999', value:500},
        {title:'Very High', range: '1000+', value:1000},
    ];

    //--------------------------------------------------------------------
    // Set margins + size
    //--------------------------------------------------------------------
    var margin = {
        top: 50,
        right: 70,
        bottom: 180,
        left: 140
    }

    var width = 960 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;

    var swatch = { width: 50, height: 20, margin: 10 };


    //--------------------------------------------------------------------
    // Create scale functions
    //--------------------------------------------------------------------
    var maxCommits = d3.max(repos, function(d){ return +d.numCommits });

    var x = d3.scale.linear()
        .range([0, width])
        .domain([0, maxCommits])

    var y = d3.scale.ordinal()
        .rangeRoundBands([height,0], .1)
        .domain(repos.map(function(repo) { return repo.name; }));

    var color = d3.scale.linear()
        .domain([0, d3.max(popularityScale, function(d) { return d.value } )])
        .interpolate(d3.interpolateRgb)
        .range(['hsl(210,30%,60%)', '#f00'])

    var popularity = d3.scale.ordinal()
        .rangeRoundBands([0,width], .1)
        .domain(popularityScale.map(function(popularityType) {return popularityType.name;} ))


    //--------------------------------------------------------------------
    // Create axes functions
    //--------------------------------------------------------------------
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom');

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')

    var colorKeyAxis = d3.svg.axis()
        .scale(popularity)
        .orient('bottom')


    //--------------------------------------------------------------------
    // Initial chart setup
    //--------------------------------------------------------------------
    var chart = d3.select(chartSelector)
        .attr('width', width + margin.left + margin.right )
        .attr('height', height + margin.top + margin.bottom )
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


    //--------------------------------------------------------------------
    // Draw axes
    //--------------------------------------------------------------------
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


    //--------------------------------------------------------------------
    // Draw color key
    //--------------------------------------------------------------------
    var colorKey = chart.append('g')
        .attr('class', 'color-key')
        .attr('transform', 'translate(0,'+(height+70)+')')
        .append('text')
        .attr('class', 'h5')
        .text('Popularity')
        .append('tspan')
        .attr('class', 'small')
        .text(' (follows + stars + forks)')

    var colorKeyGroup = chart.select('.color-key')
        .selectAll('.color-key-group')
        .data(popularityScale)
        .enter()
        .append('g')
        .attr('class', 'color-key-group')
        .attr('transform', function(d, i) { 
            return 'translate(' + (i*(swatch.width+swatch.margin))+ ','+ swatch.margin+')' 
        });

    colorKeyGroup.append('rect')
        .attr('fill', function(d) { return color(d.value); })
        .attr('width', swatch.width)
        .attr('height', swatch.height)

    colorKeyGroup.append('text')
        .attr('class', 'level')
        .attr('dx', swatch.width)
        .attr('dy', '1em')
        .attr('y', swatch.height)
        .text(function(d) { return d.title })
        .append('tspan')
        .attr('x', 0)
        .attr('dx', swatch.width)
        .attr('style', 'text-anchor:middle')
        .attr('dy', '1.1em')
        .text(function(d) { return '(' + d.range + ')' })


    //--------------------------------------------------------------------
    // Draw bars
    //--------------------------------------------------------------------
    var bar = chart.selectAll('.bar-group')
        .data(repos)
        .enter()
        .append('g')
        .attr('class', 'bar-group')
        .attr('transform', function(d) { return 'translate(0,' + (y(d.name)) + ')'})

    bar.append('rect')
        .attr('class', 'bar')
        .attr('dy', y.rangeBand() )
        .attr('height', y.rangeBand() )
        .attr('width', function(d) { return x(d.numCommits) } )
        .attr('fill', function(d) { return color(d.popularity); })
    
    bar.append('text')
        .attr('class', 'amount')
        .attr('y', y.rangeBand()/2 )
        .attr('dy', '.25em')
        .attr('x', function(d) { return x(d.numCommits) + 5 } )
        .text(function(d) {return d.numCommits; })
}

