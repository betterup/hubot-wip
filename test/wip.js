// setup env
var defaultGithubOrganization = 'mycompany';
process.env.HUBOT_GITHUB_USER = defaultGithubOrganization;

require('coffee-script/register');
var Helper = require('hubot-test-helper');
var helper = new Helper('../scripts/wip.js');
var chai = require('chai');
var expect = chai.expect;

describe('wip', function() {
  var room;

  beforeEach(function() {
    room = helper.createRoom();
  });
  afterEach(function() {
    room.destroy();
  });

  var testMessagesWithoutOrganization = [
    'hubot wip myproject',
    'hubot what is in progress for myproject',
    'hubot what is inprogress for myproject',
    'hubot what is inprogress for myproject?'
  ];
  testMessagesWithoutOrganization.forEach(function(message) {
    describe('when message=' + message, function() {
      beforeEach(function() {
        room.user.say('alice',  message);
      });
      it('fires listener', function() {
        expect(room.messages).to.eql([
          ['alice', message],
          ['hubot', 'Checking for work in progress in mycompany/myproject...']
        ]);
      });
    });
  });

  var testMessagesWithOrganization = [
    'hubot wip myothercompany/myproject',
    'hubot what is in progress for myothercompany/myproject',
    'hubot what is inprogress for myothercompany/myproject',
    'hubot what is inprogress for myothercompany/myproject?'
  ];
  testMessagesWithOrganization.forEach(function(message) {
    describe('when message=' + message, function() {
      beforeEach(function() {
        room.user.say('alice',  message);
      });
      it('fires listener', function() {
        expect(room.messages).to.eql([
          ['alice', message],
          ['hubot', 'Checking for work in progress in myothercompany/myproject...']
        ]);
      });
    });
  });
});
