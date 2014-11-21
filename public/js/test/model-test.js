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


    describe('increment week', function() {
        it('should increment week in the expected YYYY-MM-DD format', function() {
            var dates = [
                {input: '2014-01-01', expected: '2014-01-08' },
                {input: '2014-01-02', expected: '2014-01-09' },
                {input: '2013-12-31', expected: '2014-01-07' },
                {input: '2014-02-27', expected: '2014-03-06' },
            ]

            dates.forEach(function(date){
                input = date.input;
                expected = date.expected;
                result = Model.incrementWeek(input);
                expect(result).to.equal(expected);
            });
        });
    });


    describe('Commits per week over period' , function () {
        afterEach(function() {
          if (this.currentTest.state == 'failed') {
            console.log('\n', this.currentTest.title, '\n-----------------');
            console.log('input: ', input );
            console.log('result: ', result );
            console.log('expected: ', expected );
          }
        });


        it('should return every week over a given period', function () {
            input = ['2014-11-01', '2014-11-21'];
            expected = ['2014-10-26', '2014-11-02', '2014-11-09', '2014-11-16'];
            result = Model.getWeeksInPeriod(input);
            expect(result).to.deep.equal(expected);
            
            input = ['2014-09-01', '2014-11-14'];
            expected = ['2014-08-31', '2014-09-07', '2014-09-14', '2014-09-21', '2014-09-28', '2014-10-05', '2014-10-12', '2014-10-19', '2014-10-26', '2014-11-02', '2014-11-09'];
            result = Model.getWeeksInPeriod(input);
            expect(result).to.deep.equal(expected);
        });
    });

})