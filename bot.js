var Discord = require('discord.io');
var axios = require('axios');
var logger = require('winston');
var auth = require('./auth.json');
var discordBaseUrl = 'https://discordapp.com/api';

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';


// Initialize Discord Bot
var bot = new Discord.Client({
  token: auth.token,
  autorun: true
});

bot.on('ready', function (evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
  // Our bot needs to know if it needs to execute a command
  // for this script it will listen for messages that will start with `!`
  if (message.substring(0, 1) == '!') {
    var args = message.substring(1).split(' ');
    var cmd = args[0];

    args = args.splice(1);

    var guildId = '401505727912476682';
    var guildUrl = '/guilds/' + guildId;
    var listMembersUrl = guildUrl + '/members';
    var listRolesUrl = guildUrl + '/roles';
    var authHeader = {
      Authorization: 'Bot ' + auth.token
    };

    switch(cmd) {
      // !ping
      case 'ping':
        bot.sendMessage({ to: channelID, message: 'Hey!' });
        break;
      case 'members':
        axios({
          method: 'GET',
          url: discordBaseUrl + listMembersUrl,
          headers: authHeader
        })
          .then(function (response) {
            console.log(response);
            bot.sendMessage({ to: channelID, message: JSON.stringify(response.data) });
          })
          .catch(function (error) {
            console.log(error);
          });
        break;
      case 'roles':
        axios({
          method: 'GET',
          url: discordBaseUrl + listRolesUrl,
          headers: authHeader
        })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        break;
      default:
        bot.sendMessage({ to: channelID, message: 'Unknown command.' });
    }
  }
});