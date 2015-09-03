// Description:
//   Report current work in progress on github projects.
//
// Dependencies:
//   githubot - see https://github.com/iangreenleaf/githubot
//   underscore
//
// Configuration
//   HUBOT_GITHUB_TOKEN=your github auth token
//   HUBOT_GITHUB_USER=default organization for github projects
//   HUBOT_GITHUB_WIP_LABEL=name of label for work in progress tickets
//
// Commands:
//  Hubot what is in progress for <user>/<project>? - List issues labeled as in progress for a project
//  Hubot wip <user>/<project>? - shortcut for work in progress
//
// Author:
//   Ryan Sonnek

var githubAuthToken = process.env.HUBOT_GITHUB_TOKEN;
var defaultGithubOrganization = process.env.HUBOT_GITHUB_USER;
var wipLabel = process.env.HUBOT_GITHUB_WIP_LABEL;

module.exports = function(robot) {
  var github = require('githubot')(robot);
  var _ = require('underscore');

  function rejectPullRequests(issues) {
    var issuesWithoutPullRequests = _.filter(issues, function(issue) {
      return !issue.pull_request;
    });
    return issuesWithoutPullRequests;
  }

  var issuesInProgress = function(msg) {
    var projectWithOrganization = msg.match[1].split('/');
    var organization = projectWithOrganization[projectWithOrganization.length - 2] || defaultGithubOrganization;
    var project = projectWithOrganization[projectWithOrganization.length - 1]

    var orgProject = organization + '/' + project;
    msg.send('Checking for work in progress in ' + orgProject + '...');
    github.get('/repos/' + orgProject + '/issues?filter=all&labels=' + wipLabel + '&sort=updated&direction=asc', function(issues) {
      var issuesWithoutPullRequests = rejectPullRequests(issues);
      if (issuesWithoutPullRequests.length === 0) {
        msg.send('No issues currently in progress for ' + orgProject);
      } else {
        var message = 'These issues are currently in progress for ' + orgProject + ':';
        issuesWithoutPullRequests.forEach(function(issue) {
          message += "\n* #" + issue.number + ' - ' + issue.title;
        });
        msg.send(message);
      }
    });
  };
  robot.respond(/.+in\s?progress for ([a-zA-Z-_\/]+)/i, issuesInProgress);
  robot.respond(/wip (\S+)/i, issuesInProgress);
};
