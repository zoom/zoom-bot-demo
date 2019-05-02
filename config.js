const env = process.env.NODE_ENV || 'production';

// insert your API Key & Secret for each environment,
// keep this file local and never push it to repo.
const config = {
  development: {
    clientID: '',
    clientSecret: '',
    redirect_uri: '',
    verifyCode: '',
    botJid: '',
    botName: '',
    account_id: '',
  },

  production: {
    clientID: '',
    clientSecret: '',
    redirect_uri: '',
    verifyCode: '',
    botJid: '',
    botName: '',
    account_id: '',
  },
};

module.exports = config[env];
