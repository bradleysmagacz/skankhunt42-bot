const Discord = require('discord.io');
const axios = require('axios');
const logger = require('winston');
const auth = require('../auth.json');
const discordService = require('../discordService');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';


// Initialize Discord Bot
const bot = new Discord.Client({
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
    let args = message.substring(1).split(' ');
    const cmd = args[0];

    args = args.splice(1);

    const sendBotMessage = (msg) => {
      bot.sendMessage({to: channelID, message: typeof msg === 'string' ? msg : JSON.stringify(msg) })
    };

    const guildId = '401505727912476682';
    const guildUrl = `guilds/${guildId}`;
    const membersUrl = `${guildUrl}/members`;
    const rolesUrl = `${guildUrl}/roles`;

    const commandList = {
      ping: () => sendBotMessage('Pong!'),
      members: () => discordService.get(membersUrl).then(res => sendBotMessage(res)),
      roles: () => discordService.get(rolesUrl).then(res => sendBotMessage(res)),
    }

    const runBotCommand = (command) => commandList[command] || sendBotMessage('Unknown command.');

    return runBotCommand(cmd);
  }
});