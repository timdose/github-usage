
var Model = new function() {
    var self = this;

    self.getCommitsPerRepo = function(data) {
        var repos = data.repos.map(function(repo){
            return { 
                name:repo.name, 
                numCommits: repo.numCommits,
                popularity: repo.watchers_count + repo.stargazers_count + repo.forks_count
            }
        })
        .filter(function(repo) {
            return repo.numCommits > 0;
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

    self.getWeek = function(parseableDateStamp) {
        var d = new Date(parseableDateStamp);
        // Should handle time zone stuff correctly here...
        var day = d.getDay();
        var sunday = new Date(d.setDate(d.getDate()-day));
        var month = ('0' + (sunday.getMonth()+1)).substr(-2,2);
        var date = ('0' + sunday.getDate()).substr(-2,2);
        var formatted = [sunday.getFullYear(),month,date].join('-')
        return formatted;
    }

}
