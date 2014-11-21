

function getLocalDate(dateString) {
    if ( dateString === undefined ) {
        d = new Date();
    } else {
        d = new Date(dateString);
    }

    var timezoneOffset = d.getTimezoneOffset()/60;
    return new Date(d.setHours(d.getHours() + timezoneOffset));
}


var Model = new function() {
    var self = this;

    self.getCommitsPerRepo = function(data) {
        var repos = data.repos.map(function(repo){
            var result = { 
                name:repo.name, 
                numCommits: repo.numCommits,
                popularity: repo.watchers_count + repo.stargazers_count + repo.forks_count
            }
            return result;
        })
        .filter(function(repo) {
            return repo.numCommits > 0;
        })
        .sort(function(a, b) {
            return a.numCommits - b.numCommits;
        });
        return repos;
    }


    self.getCommitsPerWeek = function(data) {
        var commits = [];

        data.repos.forEach(function(repo){
            Array.prototype.push.apply(commits, repo.commits);
        });


        var weeks = d3.nest()
            .key(function(commit){
                return self.getWeek(commit.commit.author.date);
            })
            .rollup(function(values) { return values.length; })
            .entries(commits)
            .map(function(week) {
                return {date:week.key, numCommits: week.values };
            })
            .sort(function(a, b) {
                return new Date(b.date) - new Date(a.date);
            });

        return weeks;
    }



    self.getCommitsOverPastWeeks = function( commitsByWeek, startDate, numWeeks ) {
        var rangeWeeks = self.getPastWeeks(startDate, numWeeks );

        var result = [];

        // blah—this could be way more efficient
        rangeWeeks.forEach(function(rangeWeek) {
            var obj = {date:rangeWeek, numCommits:0};
            commitsByWeek.forEach(function(week) {
                if ( week.date == rangeWeek ) {
                    obj.numCommits = week.numCommits
                }
            });

            result.push(obj);
        });

        return result;
    }


    // This could be modified to accept a Date object or parseable date string
    self.getWeek = function(inputDate) {
        var d = inputDate instanceof Date? inputDate : new Date(inputDate);
        // Should handle time zone stuff correctly here...
        var day = d.getDay();
        var sunday = new Date(d.setDate(d.getDate()-day));
        var month = ('0' + (sunday.getMonth()+1)).substr(-2,2);
        var date = ('0' + sunday.getDate()).substr(-2,2);
        var formatted = [sunday.getFullYear(),month,date].join('-')
        return formatted;
    }


    self.changeWeek = function(formattedDate, numWeeks) {
        if ( numWeeks === undefined ) {
            numWeeks = 1;
        }
        var dateFormat = d3.time.format('%Y-%m-%d');
        var d = dateFormat.parse(formattedDate);
        var incremented = new Date(d.setDate(d.getDate() + (7*numWeeks)) );
        return dateFormat(incremented);
    }


    self.getPastWeeks = function(startDate, numWeeks) {
        var iWeek = self.getWeek(startDate);
        // var startWeek = self.changeWeek(finalWeek, - (numWeeks - 1) );
        var result = [iWeek];
        for ( i = 1; i < numWeeks; i ++ ) {
            var iWeek = self.changeWeek(iWeek, -1);
            result.push(iWeek);
        }
        return result;
        // return self.getWeeksInPeriod([startWeek, finalWeek]);
    }

}
