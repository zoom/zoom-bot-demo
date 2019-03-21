const env = process.env.NODE_ENV || 'production'

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
		clientID : '1A6aLZlGRdyDFilNPJ32oQ',
		clientSecret : 'E1zUdKvNGOEqqoKFnCiqpexcCdpnBqz1',
		redirectUrl : 'http://db1fc3ac.ngrok.io/oauth',
		redirect_uri: 'http://db1fc3ac.ngrok.io/oauth',
		verifyCode : 'xNH5cu93SIqfMNW1YSyeTw',
		botJid : 'v1dxzr-odxqa-7olovln_izq@xmpp.zoom.us',
		botName : 'testnewbot',
		to_jid : '44736754f13945c4801d32155c360846@conference.xmpp.zoom.us',
		toJid : '44736754f13945c4801d32155c360846@conference.xmpp.zoom.us',
		account_id : 'UZtZ7oAkSLiY5cSYx2KbTA',
	}
};

module.exports = config[env]
