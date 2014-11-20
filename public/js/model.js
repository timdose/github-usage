
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
                var d = new Date(commit.commit.author.date);
                var day = d.getDay();
                var sunday = new Date(d.setDate(d.getDate()-day));
                var month = ('00' + (sunday.getMonth()+1)).substr(-2,2);
                var date = ('00' + sunday.getDate()).substr(-2,2);
                var formatted = [sunday.getFullYear(),month,date].join('-')
                return formatted;
            })
            .rollup(function(values) { return values.length; })
            .entries(commits)
            .map(function(week) {
                return {name:week.key, numCommits: week.values };
            })
            .sort(function(a, b) {
                return new Date(a.name) - new Date(b.name);
            });

        return weeks;
    }

}
