var expect = chai.expect;



describe('getLocalDate()', function() {
    var input, expected, result;

    afterEach(function() {
      if (this.currentTest.state == 'failed') {
        console.log('\n', this.currentTest.title, '\n-----------------');
        console.log('input: ', input );
        console.log('result: ', result );
        console.log('expected: ', expected );
      }
    });

    it('should return a Date string in the current time zone', function() {
        var cases = [
            { input: '2014-11-15T02:20:12Z', expected: new Date(2014,10,15,2,20,12)},
            { input: '2014-11-16T02:20:12Z', expected: new Date(2014,10,16,2,20,12)},
            { input: '2014-11-16T18:20:12Z', expected: new Date(2014,10,16,18,20,12)},
            { input: '2014-11-09T02:20:12Z', expected: new Date(2014,10,9,2,20,12)}
        ]

        cases.forEach(function(thisCase){
            input = thisCase.input;
            expected = thisCase.expected;
            result = getLocalDate(input);
            expect(result).to.deep.equal(expected);
        });
    });
});




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

    afterEach(function() {
      if (this.currentTest.state == 'failed') {
        console.log('\n', this.currentTest.title, '\n-----------------');
        console.log('input: ', input );
        console.log('result: ', result );
        console.log('expected: ', expected );
      }
    });



    describe('.getWeek()', function() {

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

        it('should accept a parseable date string or a Date object', function () {
            var dates = [
                { input: '2014-11-17T02:20:12Z', expected: '2014-11-16'},
                { input: new Date('2014-11-17T02:20:12Z'), expected: '2014-11-16'},

            ]

            dates.forEach(function(date){
                input = date.input;
                expected = date.expected;
                result = Model.getWeek(input);
                expect(result).to.equal(expected);
            });
            
        });
    });



    describe('.getCommitsPerWeek()', function() {

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

        it ('should group commits by week and total them', function() {
            result = Model.getCommitsPerWeek(data);
            expect(result).to.deep.equal(expected);
        })
    })



    describe('.getCommitsOverPastWeeks()', function() {

        before(function(done) {
            $.ajax({
                url: '/js/test/data/commits-over-period-expected.json',
                dataType: 'json'
            })
            .done( function( result ) {
                expected = result;
                done();
            })
        });


        it ('should give commits over past N weeks with 0 as count for weeks with no commits', function() {
            input = {
                numWeeks: 12,
                commits: [
                    {
                      "date": "2014-11-16",
                      "numCommits": 3
                    },
                    {
                      "date": "2014-11-09",
                      "numCommits": 1
                    },
                    {
                      "date": "2014-10-19",
                      "numCommits": 1
                    },
                    {
                      "date": "2014-10-05",
                      "numCommits": 1
                    },
                    {
                      "date": "2014-09-21",
                      "numCommits": 2
                    },
                    {
                      "date": "2014-03-16",
                      "numCommits": 2
                    }
                ]
            }
            result = Model.getCommitsOverPastWeeks(input.commits, '2014-11-18', input.numWeeks );
            expect(result).to.deep.equal(expected);
        })
    })



    describe('.changeWeek()', function() {

        it('should decrement by some number of weeks', function() {

            var dates = [
                {input: { date: '2014-01-08', increment: -1 }, expected: '2014-01-01' },
                {input: { date: '2014-01-08', increment: -2 }, expected: '2013-12-25' },
                {input: { date: '2014-01-08', increment: -12 }, expected: '2013-10-16' },
            ]

            dates.forEach(function(date){
                inputDate = date.input.date;
                inputIncrement = date.input.increment;
                expected = date.expected;
                result = Model.changeWeek(inputDate, inputIncrement);
                expect(result).to.equal(expected);
            });
        });


        it('should increment by some number of weeks', function() {

            var dates = [
                {input: { date: '2014-01-01', increment: 1 },  expected: '2014-01-08' },
                {input: { date: '2013-12-25', increment: 2 },  expected: '2014-01-08' },
                {input: { date: '2013-10-16', increment: 12 }, expected: '2014-01-08' },
            ]

            dates.forEach(function(date){
                inputDate = date.input.date;
                inputIncrement = date.input.increment;
                expected = date.expected;
                result = Model.changeWeek(inputDate, inputIncrement);
                expect(result).to.equal(expected);
            });
        });
    });



    describe('.getPastWeeks()', function() {

        it('should get past N weeks', function() {

            var cases = [
                { 
                    input: { date: '2014-11-20', numWeeks: 12 }, 
                    expected: [
                        '2014-11-16',
                        '2014-11-09',
                        '2014-11-02',
                        '2014-10-26',
                        '2014-10-19',
                        '2014-10-12',
                        '2014-10-05',
                        '2014-09-28',
                        '2014-09-21',
                        '2014-09-14',
                        '2014-09-07',
                        '2014-08-31'
                    ]
                },
                { 
                    input: { date: '2014-11-10', numWeeks: 3 }, 
                    expected: [
                        '2014-11-09',
                        '2014-11-02',
                        '2014-10-26'
                    ]
                }
            ]

            cases.forEach(function(thisCase){
                input = thisCase.input;
                inputDate = input.date;
                numWeeks = input.numWeeks;
                expected = thisCase.expected;
                result = Model.getPastWeeks(inputDate, numWeeks);
                expect(result).to.deep.equal(expected);
            });
        });
    });


})