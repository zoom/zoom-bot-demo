const env = process.env.NODE_ENV || 'production'

//insert your API Key & Secret for each environment, keep this file local and never push it to repo.
const config = {
	development :{
		clientID : '',
		clientSecret : '',
		redirectUrl : '',
		redirect_uri: '',
		verifyCode : '',
		botJid : '',
		botName : '',
		to_jid : '',
		account_id : '',


	},
	production:{
		clientID : '',
		clientSecret : '',
		redirectUrl : '',
		redirect_uri: '',
		verifyCode : '',
		botJid : '',
		botName : '',
		to_jid : '',
		toJid : '',
		account_id : '',
	}
};

module.exports = config[env]
