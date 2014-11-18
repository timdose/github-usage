
$(document).ready(function() {
    $('#input').on('submit', function(event) {
        fetchData($('#user').val());
        event.preventDefault();
    });

    $('#input button').click();
});


function fetchData(user) {
    $.ajax({
        url: '/api/user/' + user,
        dataType: 'json'
    })
    .done( function( data ) {
        drawCommitsByRepoChart(data);
    })
    .error( function(err) {
        console.log(err);
    });
}

