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
		clientID : 'uhdF1HUjSomSeXamTnvQw',
		clientSecret : 'xR0Whum1uZhZfWq0GpviuNdBuRB3SR1z',
		redirectUrl : 'http://d8a127b4.ngrok.io/oauth',
		redirect_uri: 'http://d8a127b4.ngrok.io/oauth',
		verifyCode : 'imnnhR3nTdKE6-hjJbKhOg',
		botJid : 'v1tq9jtpkvr8gy9frjb6weqw@xmpp.zoom.us',
		botName : 'ZoomTestBot2',
		to_jid : '8a9e9742c71a4371829d2acc1b24f646@conference.xmpp.zoom.us',
		toJid : '8a9e9742c71a4371829d2acc1b24f646@conference.xmpp.zoom.us',
		account_id : 'jQfUT1woQra0opXcYeanFQ',
	}
};

module.exports = config[env]
