
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
        $('.username').text(user);

        var commitsPerRepo = Model.getCommitsPerRepo(data);
        drawCommitsByRepoChart(commitsPerRepo);
        
        var commitsPerWeek = Model.getCommitsPerWeek(data);
        var recentCommits = Model.getCommitsOverPastWeeks(commitsPerWeek, new Date(), 12 );
        
        drawRecentCommitsChart(recentCommits);

        $('.results').fadeIn();
    })
    .error( function(err) {
        console.log(err);
    });
}

