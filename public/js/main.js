
$(document).ready(function() {
    $('#form').on('submit', function(event) {
        fetchData($('#user').val());
        event.preventDefault();
    });
});


function fetchData(user) {
    $.ajax({
        url: '/api/user/' + user,
        dataType: 'json'
    })
    .done( function( data ) {
        var commitsPerRepo = Model.getCommitsPerRepo(data);
        drawCommitsByRepoChart(commitsPerRepo);
        
        var commitsPerWeek = Model.getCommitsPerWeek(data);
        drawCommitsPerWeekChart(commitsPerWeek);

        var recentCommits = Model.getCommitsOverPastWeeks(commitsPerWeek, new Date(), 12 );
        
        drawRecentCommitsChart(recentCommits);
    })
    .error( function(err) {
        console.log(err);
    });
}

