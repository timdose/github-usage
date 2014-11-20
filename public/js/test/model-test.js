var expect = chai.expect;

describe('Model', function() {
    var data;

    before(function(done) {
        $.ajax({
            url: '/js/test/data/api-result.json',
            dataType: 'json'
        })
        .done( function( result ) {
            data = result;
            done();
        })
    });


    describe('Commits per Week', function() {
        var expected;

        before(function(done) {
            $.ajax({
                url: '/js/test/data/recent-commits-expected.json',
                dataType: 'json'
            })
            .done( function( result ) {
                expected = result;
                done();
            })
        });

        it ('should load two files', function() {
            expect(expected).to.deep.equal(data);
        })
    })
})