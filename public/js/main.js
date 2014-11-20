
$(document).ready(function() {
    $('#form').on('submit', function(event) {
        Model.fetchData($('#user').val(), function(data) {
            var commitsPerRepo = Model.getCommitsPerRepo(data);
            drawCommitsByRepoChart(commitsPerRepo);
            
            var commitsPerWeek = Model.getCommitsPerWeek(data);
            drawCommitsPerWeekChart(commitsPerWeek);
        });
        event.preventDefault();
    });
});



