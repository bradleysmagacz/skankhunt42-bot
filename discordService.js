const axios = require('axios');
const auth = require('./auth.json');

class DiscordService {
  constructor() {
    this.discordApiBase = 'https://discordapp.com/api';
    this.authHeader = {
      Authorization: `Bot ${auth.token}`
    };
  }

  get(url) {
    return axios({
      method: 'GET',
      url: `${this.discordApiBase}/${url}`,
      headers: this.authHeader
    }).then(res => res.data);
  }
}

module.exports = new DiscordService();