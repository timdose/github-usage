
$(document).ready(function() {
    $('#form').on('submit', function(event) {
        fetchData($('#user').val());
        event.preventDefault();
    });

    $('#form').submit();
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

