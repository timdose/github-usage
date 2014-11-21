
$(document).ready(function() {
    $('#form').on('submit', function(event) {
        fetchData($('#user').val());
        event.preventDefault();
    });
});


function fetchData(user) {
    $('.results, .message').fadeOut();

    $.ajax({
        url: '/api/user/' + user,
        dataType: 'json'
    })
    .done( function( data ) {
        if (data.repos.length == 0 ) {
            $('.message').fadeIn();
        } else {
            drawCharts(user, data);
        }
    })
    .error( function(err) {
        console.log(err);
    });
}


function drawCharts(user, data) {
    $('.username').text(user);

    var commitsPerRepo = Model.getCommitsPerRepo(data);
    drawCommitsByRepoChart(commitsPerRepo);
    
    var commitsPerWeek = Model.getCommitsPerWeek(data);
    var recentCommits = Model.getCommitsOverPastWeeks(commitsPerWeek, new Date(), 12 );
    
    drawRecentCommitsChart(recentCommits);

    $('.results').fadeIn();
}
