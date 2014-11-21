var expect = chai.expect;

describe('Model', function() {
    var data, input, expected, result;

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



    describe('getWeek()', function() {
        afterEach(function() {
          if (this.currentTest.state == 'failed') {
            console.log('\n', this.currentTest.title, '\n-----------------');
            console.log('input: ', input );
            console.log('result: ', result );
            console.log('expected: ', expected );
          }
        });

        it('should correctly give the week as the date of the most recent Sunday in format YYYY-MM-DD', function () {
            var dates = [
                { input: '2014-11-17T02:20:12Z', expected: '2014-11-16'},
                { input: '2014-11-16T02:20:12Z', expected: '2014-11-16'}, // This fails due to timezone behavior in JS!
                { input: '2014-11-16T18:20:12Z', expected: '2014-11-16'}, // This fails due to timezone behavior in JS!
                { input: '2014-11-15T02:20:12Z', expected: '2014-11-09'},
                { input: '2014-11-15T05:20:12Z', expected: '2014-11-09'},
                { input: '2014-11-14T02:20:12Z', expected: '2014-11-09'},
                { input: '2014-11-13T02:20:12Z', expected: '2014-11-09'},
                { input: '2014-11-12T02:20:12Z', expected: '2014-11-09'},
                { input: '2014-11-11T02:20:12Z', expected: '2014-11-09'},
                { input: '2014-11-10T02:20:12Z', expected: '2014-11-09'},
                { input: '2014-11-09T02:20:12Z', expected: '2014-11-09'}, // This fails due to timezone behavior in JS!
                { input: '2014-03-01T02:20:12Z', expected: '2014-02-23'},
            ]

            dates.forEach(function(date){
                input = date.input;
                expected = date.expected;
                result = Model.getWeek(input);
                expect(result).to.equal(expected);
            });
            
        });
    });



    describe('Commits per Week', function() {
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

        afterEach(function() {
          if (this.currentTest.state == 'failed') {
            console.log('\n', this.currentTest.title, '\n-----------------');
            console.log('result: ', result );
            console.log('expected: ', expected );
          }
        });

        it ('should group commits by week and total them', function() {
            result = Model.getCommitsPerWeek(data);
            expect(result).to.deep.equal(expected);
        })
    })

})