
$(document).ready(function() {
    $('#input').on('submit', function(event) {
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
        drawCommitsByRepoChart(data);
        drawCommitsPerWeekChart(data);
    })
    .error( function(err) {
        console.log(err);
    });
}

