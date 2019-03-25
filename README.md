1.	Clone the github repo https://github.com/ojusave/Zoom-Demo

2.	If you are not using the ‘Dev’ environment, comment out the following line: setting.setUrl('https://dev.zoom.us')

3.	Add the following values in config.js:
Client ID, Client Secret, Redirect URI, Account ID, Channel ID and BotJID

•	You can find your Client ID and Client Secret, in your BOT section, when you login to the marketplace.zoom.us. Make sure that you are using the credentials for the correct version. At the same time, make sure that your redirect URI is similar to the one in your marketplace bot account.

Please refer to the following screenshot:
 


•	To get your Account ID, send the following request:
https://api.zoom.us/v2/users

•	To get your Channel ID, send the following request https://api.zoom.us/v2/im/users/{UserID}/channels


•	The verify code and BotJID can be found, in the features section of your BOT. 
Please refer to the following section for more details:
 

4.	Go to your Local terminal, and run the following command:
“node index.js”

5.	Go to your Zoom Desktop client and then type the following commands: 

Actions:
When you enter the "Actions" command, the bot displays two buttons

Links:
When you enter this command, you will see an example with clickable links

Fields:
When you enter this command, you will see an example with two fields 

Cards:
When you enter this command, you will see three types of examples: 
 - a simple message, 
 - a message with a clickable link and  
 - a message with style

6.	For more Information about Zooms Bot and APIs
       Documentation is available on the Zoom REST API for IM chat
