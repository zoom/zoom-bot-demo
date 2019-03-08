const env = process.env.NODE_ENV || 'development'

//insert your API Key & Secret for each environment, keep this file local and never push it to repo.
const config = {
	development :{
		clientID : 'nKZmSkNSSXOxFcVCtB0jaA',
		clientSecret : 'cI9PraeqEXzNM0mSYpIh7LHWW9kkJurQ',
		redirectUrl : 'https://bb7fe819.ngrok.io',
		verifyCode : 'wtIceovcROe68qBa_NsDgQ',
		botJid : 'v1prfqdonqtjw9e4urow4bca@xmppdev.zoom.us',
		botName : 'OjusNewBotTest',
		to_jid : '88f148d43f0141f6a2901225ef6f5e49@conference.xmppdev.zoom.us',
		accountId : 'Uoj5nh68RtK_C737r6XTIw'

	},
	production:{
		clientID : 'cL1ooSNoQxWpUkyPHll3dg',
		clientSecret : 'Ox23DK8FOVLNKEcYnwnO0WTXYuJVAzyC',
		redirectUrl: 'http://localhost:3003/oauth/'
	}
};

module.exports = config[env]
