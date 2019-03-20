Building a simple chatbot using the Zoom NodeJS SDK (Using Example 1)


Introduction:

The Zoom NodeJS Bot library provides interfaces which help you to build chatbots and applications for the Zoom messaging framework. This library has implemented various complex features like oAuth2, sending messages and receiving notifications to and from Zoom client, so that you can focus on building your own features of your application.

Requirements:
This package supports Node v8 and higher.

Installation:
1.	NodeJS
If you haven’t installed NodeJS, please follow the steps mentioned here: https://nodesource.com/blog/installing-nodejs-tutorial-mac-os-x/ .

2.	Verify if Node.js is properly installed:

      a.	To verify that Node.js was installed correctly on your Mac, you can run the following command in your terminal:
“$ node -v”

      b.	If Node.js was properly installed, you'll see something close to (but probably not exactly) this:
$ node -v // The command we ran - tests the version of Node.js that's currently installed 
v6.9.4 // The version of Node.js that's installed - v6.9.4 was the most current LTS release at the time of writing.


      c.	Update your npm Version:
$ sudo npm install npm --global // Update the `npm` CLI client.

3.	Installing Zoom SDK:
To install the Zoom SDK, type the following command in your terminal:
npm install zoom-bot-sdk

4.	Clone the repo using git clone.
git clone https://github.com/zoom/zoom-bot-api.git


QuickStart:
1.	If you are not using the ‘Dev’ environment, comment out the following line: setting.setUrl('https://dev.zoom.us')
2.	In the Index.js file, where it says
const to_jid = ;
const account_id = ; ,

please input your Channel JID, and your BOT Account ID.

To get your Account ID, send the following request:
https://api.zoom.us/v2/users

To get your Channel ID, send the following request https://api.zoom.us/v2/im/users/{UserID}/channels

3.	In the ‘let oauth2Client = oauth2()’, function, add the following values:
Client ID, Client Secret and your Redirect URI.

You can find your Client ID and Client Secret, in your BOT section, when you login to marketplace.zoom.us. Make sure that you are using the credentials for the correct version. At the same time, make sure that your redirect URI is similar to the one in your marketplace bot account.
Please refer to the following screenshot:
 
4.	In the “let zoomBot = client(clientId,verifyCode,botJid,botName)” function, add the following values: 
ClientID, Verify Code, BotJID and Bot Name

The verify code and BotJID can be found, in the features section of your BOT. 
Please refer to the following section for more details:
 
5.	Go to your Local terminal, and run the following command:
“node index.js”

6.	Go to your Zoom Desktop client and then type the following commands: 
/help : This command displays all the available commands in your app
/create: allows you to create a message and send it

For e.g: create HelloOj 2019-03-19, and the bot will send you the similar information.

7.	For more Information about Zooms Bot and APIs
       Documentation is available on the Zoom REST API for IM chat







