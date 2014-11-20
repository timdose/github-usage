
$(document).ready(function() {
    $('#form').on('submit', function(event) {
        $.ajax({
            url: '/api/user/' + user,
            dataType: 'json'
        })
        .done( function( data ) {
            var commitsPerRepo = Model.getCommitsPerRepo(data);
            drawCommitsByRepoChart(commitsPerRepo);
            
            var commitsPerWeek = Model.getCommitsPerWeek(data);
            drawCommitsPerWeekChart(commitsPerWeek);
        })
        .error( function(err) {
            console.log(err);
        });

        event.preventDefault();
    });
});



