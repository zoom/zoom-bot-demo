const env = process.env.NODE_ENV || 'development'

//insert your API Key & Secret for each environment, keep this file local and never push it to repo.
const config = {
	development :{
		clientID : 'MUqsqBxxT7mF4nuaJ2Ua8Q',
		clientSecret : 'aw2Mv4EZ6e00dZ3j4aCgoo2b8x3eWvp1',
		redirectUrl : 'http://8d10eb12.ngrok.io/oauth',
		redirect_uri: 'http://8d10eb12.ngrok.io/oauth',
		verifyCode : 'PBBR9irlQHGVWSg5qJEbGQ',
		botJid : 'v11_dokxygrn2p0aqf4-dv7q@xmpp.zoom.us ',
		botName : 'ZoomChatbot1',
		to_jid : 'jqfut1woqra0opxcyeanfq@xmpp.zoom.us',
		account_id : 'J5yuBxbFT0iKHvOh1iR3Rg',


	},
	production:{
		clientID : 'cL1ooSNoQxWpUkyPHll3dg',
		clientSecret : 'Ox23DK8FOVLNKEcYnwnO0WTXYuJVAzyC',
		redirectUrl: 'http://localhost:3003/oauth/'
	}
};

module.exports = config[env]
