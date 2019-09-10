#### THIS REPO IS DEPRECATED

Please visit our [new Chatbot NPM sample app](https://github.com/zoom/vote-chatbot).

---

QuickStart:

1. Clone the GitHub repo https://github.com/zoom/zoom-bot-demo

2. Add the following values in config.js:
Client ID, Client Secret, Redirect URI, Account ID, Channel ID, and BotJID

      a. You can find your Client ID and Client Secret, by going to Marketplace > Manage > “Your Bot” > App Credentials. Make sure that you are using the correct credentials (i.e. Development or Production). 

      b. At the same time, make sure that your redirect URI is similar to the one in your marketplace bot account. If you do not have a redirect URI, we recommend using a localhost tunneling software such as ngrok.io.

      Please refer to the following screenshot:

      ![alt text](http://s3.amazonaws.com/user-content.stoplight.io/14683/1554148180886)


      c. To get your Account ID, use the [retrieve user API](https://marketplace.zoom.us/docs/api-reference/zoom-api/users/users):
      https://api.zoom.us/v2/users

      d. To get your Channel ID, use the [retrieve channel API](https://marketplace.zoom.us/docs/api-reference/zoom-api/im-chat/getchatchannels):
      https://api.zoom.us/v2/im/users/{UserID}/channels

      Once you receive a response, your 'channel id' would be the value received for the 'group_jid' field.

      You can consider using Postman to make requests to our API’s. For more information, please visit here.


      e. The verify code (Verification Token) and BotJID can be found, in the features section of your BOT. 

      Please refer to the following section for more details:
      ![alt text](http://s3.amazonaws.com/user-content.stoplight.io/14683/1554149625443)

4. Go to your Local terminal, and run the following command:
“node index.js”



5. 
      a. If you are using the Development environment, you can generate the OAuth token to be used locally by clicking the “Test” button, in the Local Test section. You can also choose to “Generate” the testable url and then paste the URL in your browser to generate the OAuth Token.

      b.	If you are using the Production Credentials, go to the Submit section, and generate a publishable URL. You can use this URL, not only to generate the OAuth Token but also to share an early download link of your application before it goes live.

6. Go to your Zoom Desktop client and then type the following commands: 

* *Simple* :
When you enter the "Simple" command, the bot displays a simple text message


* *Actions*:
When you enter the "Actions" command, the bot displays two buttons


* *Links*:
When you enter this command, you will see an example with clickable links

* *Style*:
When you enter the "Style" command, the bot displays a message and header with style


* *Fields*:
When you enter this command, you will see an example with two fields 

* *Cards*:
When you enter this command, you will see three types of examples: 
     - a simple message, 
     - a message with a clickable link and  
     - a message with style
 
7. You can also customize the Body and Title for your Bot. To know the syntax for a command, type the 'slash command' and then help, or you can refer to this image which shows an example of the help command as well as the customization syntaxes for the commands:

![alt text](http://s3.amazonaws.com/user-content.stoplight.io/14683/1554149750448)

For more Information about Zooms Bot and APIs Documentation is available on the Zoom REST API for IM chat
