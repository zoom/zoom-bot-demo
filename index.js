const express = require('express');
const config = require('./config'); // values would be derived from config.js
const http = require('http');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// eslint-disable-next-line no-unused-vars
const {oauth2, client, setting} = require('zoom-bot-sdk');

// eslint-disable-next-line max-len
// By Default the SDK uses api.zoom.us, if you are using Dev credentials, uncomment the below line

// setting.setUrl('https://dev.zoom.us');

// eslint-disable-next-line max-len
// Creating an OAuth2 object with the given configurations, you can find these values in the app that you created in Marketplace,  visit: www.marketplace.zoom.us
const oauth2Client = oauth2(
    config.clientID, // client id
    config.clientSecret, // client secret
    config.redirect_uri, // redirect uri
);

// Print Tokens, (Optional)
oauth2Client.on('tokens', function(tokens) {
  console.log(tokens, 999);
});

// If there is an error print it, (Optional)
oauth2Client.on('error', (err)=> {
  console.log(err);
});

// eslint-disable-next-line max-len
// creating a zoomBot instance to configure the Help command, you can find these values in your application in Marketplace, visit: markeplace.zoom.us
const zoomBot = client(
    config.clientID, // client id
    config.verifyCode, // verify code
    config.botJid, // jid
    // eslint-disable-next-line max-len
    config.botName).commands([{command: 'Simple :', description: 'When you enter this command you will see an example with a simple message, \nSyntax: "simple" "title" "text"'},
  // eslint-disable-next-line max-len
  {command: 'Actions :', description: 'When you enter the "Actions" command, the bot displays two buttons, \nSyntax: actions "title" "button1" "button2"  '},
  // eslint-disable-next-line max-len
  {command: 'Links :', description: 'When you enter this command you will see an example with clickable links, \nSyntax: links "title" "text" "link"'},
  // eslint-disable-next-line max-len
  {command: 'Fields :', description: 'When you enter this command you will see an example with two fields, \nSyntax: fields "title" "key 1" "value 1" "key 2" "value 2" '},
  // eslint-disable-next-line max-len
  {command: 'Style :', description: 'When you enter this command you will see an example of a message and header with style, \nSyntax: "style" "title" "text"'},
  // eslint-disable-next-line max-len
  {command: 'sections :', description: 'When you enter this command you will see an example with sections, i.e Messages and Actions, there is also an example of footer and the sidebar color is Golden'},
  // eslint-disable-next-line max-len
  {command: 'editable :', description: 'When you enter this command you will see an example of an editable message'},
  // eslint-disable-next-line max-len
  {command: 'attachments :', description: 'When you enter this command you will see an example of a message with an attachment'},
  // eslint-disable-next-line max-len
  {command: 'dropdown :', description: 'When you enter this command you will see an example of a dropdown menu with 3 options'},
  // eslint-disable-next-line max-len
  {command: 'Cards :', description: 'When you enter this command you will see three types of examples: \n - a simple message, \n - a message with a clickable link and  \n - a message with style, \nSyntax: cards "title" "text for simple message" "text for link" "link" "text for style" "color in hex format", "Value for Bold, i.e. True / False","Value for Italics, i.e. True / False"'}]
).defaultAuth(oauth2Client.connect());


// This initiates the Zoom Bot
zoomBot.on('commands', function(e) {
  // eslint-disable-next-line max-len,no-unused-vars
  const {payload, data, type, command, message} = e;// origin message from IM is message
  // eslint-disable-next-line camelcase,no-unused-vars
  const {toJid: to_jid, accountId: account_id, name} = payload;
  let reqBody;
  let reqHeader;

  // Configuring the Actions command, for more information, visit: https://marketplace.zoom.us/docs/guides/guides/building-a-chatbot/Generating-Rich-TextBot-Message-Cards
  if (command === 'actions') {
    // eslint-disable-next-line max-len
    const text = type === 'group' ? `Your Title is ${data[0]}` : `Your Title is ${data[0]}`;
    const text1 = type === 'group' ? `${data[1]}` : `${data[1]}`;
    const text2 = type === 'group' ? `${data[2]}` : `${data[2]}`;

    // If user does not give parameters, send this body and header in message
    if (data.length == 0) {
      // eslint-disable-next-line max-len
      reqBody = [{type: 'actions', limit: '2', items: [{text: 'Update', event_id: 'update', event: 'sendMsg(\"/weather update\")'}, {text: 'Delete', event_id: 'delete', event: 'sendMsg(\"/weather delete\")'}]}];
      reqHeader = {text: 'Actions'};
      // eslint-disable-next-line brace-style
    }

    // If user provides parameters send this body and header in message
    else {
      // eslint-disable-next-line max-len
      reqBody = [{type: 'actions', limit: '2', items: [{text: text1, event_id: 'update', event: 'sendMsg(\"/weather update\")'}, {text: text2, event_id: 'delete', event: 'sendMsg(\"/weather delete\")'}]}];
      reqHeader = {text: text};
    }
    // eslint-disable-next-line brace-style
  }

  // Configuring the "simple" command

  else if (command === 'simple') {
    // console.log(reqBody, reqHeader)
    // eslint-disable-next-line max-len
    const text = type === 'group' ? `Your Title is ${data[0]}` : `Your Title is ${data[0]}`;
    const text1 = type === 'group' ? `${data[1]}` : `${data[1]}`;

    // If user does not give parameters, send this body and header in message
    if (data.length == 0) {
      reqBody = [{type: 'message', text: 'This is a simple message'}];
      reqHeader = {text: `Simple Message`};
    }

    // If user provides parameters send this body and header in message
    else {
      reqBody = [{type: 'message', text: text1}];
      reqHeader = {text: text};
    }
    // eslint-disable-next-line brace-style
  }

  // Configuring the "editable command"
  else if (command === 'editable') {
    {
      // eslint-disable-next-line max-len
      reqBody = [{type: 'message', text: 'This is an editable message', editable: 'true'}];
      reqHeader = {text: `Editable Message Example`};
    }
    // eslint-disable-next-line brace-style
  }

  // eslint-disable-next-line max-len
  // Configuring the "style" command, This command displays a message with a style

  else if (command === 'style') {
    // eslint-disable-next-line max-len
    const text = type === 'group' ? `Your Title is ${data[0]}` : `Your Title is ${data[0]}`;
    const text1 = type === 'group' ? `${data[1]}` : `${data[1]}`;

    // If user does not give parameters, send this body and header in message
    if (data.length == 0) {
      reqBody = [{
        type: 'message',
        text: 'This is a message with style',
        style: {color: '#ff0000', bold: 'true', italic: 'true'},
      }];
      // eslint-disable-next-line max-len
      reqHeader = {text: `Message with Style`, style: {color: '#ffff00', bold: 'true', italic: 'true'}};
      // eslint-disable-next-line brace-style
    }

    // If user provides parameters send this body and header in message
    else {
      // eslint-disable-next-line max-len
      reqBody = [{type: 'message', text: text1, style: {color: '#ff0000', bold: 'true', italic: 'true'}}];
      // eslint-disable-next-line max-len
      reqHeader = {text: text, style: {color: '#ff0000', bold: 'true', italic: 'true'}};
    }
    // eslint-disable-next-line brace-style
  }

  // Configuring the "link" command. This command displays an example for link.

  else if (command === 'links') {
    // eslint-disable-next-line max-len
    const text = type === 'group' ? `Your Title is ${data[0]}` : `Your Title is ${data[0]}`;
    const text1 = type === 'group' ? `${data[1]}` : `${data[1]}`;
    const text2 = type === 'group' ? `${data[2]}` : `${data[2]}`;

    // If user does not give parameters, send this body and header in message
    if (data.length == 0) {
      reqBody = [{type: 'message', text: 'www.zoom.us', link: 'www.zoom.us'}];
      reqHeader = {text: 'Links'};
    }

    // If user provides parameters send this body and header in message
    else {
      reqBody = [{type: 'message', text: text1, link: text2}];
      reqHeader = {text: text};
    }
    // eslint-disable-next-line brace-style
  }

  // eslint-disable-next-line max-len
  // Configuring the "fields" command. This command displays an example using fields.

  else if (command === 'fields') {
    // eslint-disable-next-line max-len
    const text = type === 'group' ? `Your Title is ${data[0]}` : `Your Title is ${data[0]}`;
    const text1 = type === 'group' ? `${data[1]}` : `${data[1]}`;
    const text2 = type === 'group' ? `${data[2]}` : `${data[2]}`;
    const text3 = type === 'group' ? `${data[3]}` : `${data[3]}`;
    const text4 = type === 'group' ? `${data[4]}` : `${data[4]}`;

    // If user does not give parameters, send this body and header in message
    if (data.length == 0) {
      reqBody = [{
        type: 'fields',
        // eslint-disable-next-line max-len
        items: [{key: 'Zoom', value: 'USA', editable: 'true'}, {key: 'San Jose', value: 'California'}],
      }];
      reqHeader = {text: 'Fields'};
    }

    // If user provides parameters send this body and header in message
    else {
      // eslint-disable-next-line max-len
      reqBody = [{type: 'fields', items: [{key: text1, value: text2}, {key: text3, value: text4}]}];
      reqHeader = {text: text};
    }
  }

  // eslint-disable-next-line max-len
  // Configuring the "cards" command. This command displays an example of cards .

  else if (command === 'cards') {
    // eslint-disable-next-line max-len
    const text = type === 'group' ? `Your Title is ${data[0]}` : `Your Title is ${data[0]}`;
    // eslint-disable-next-line max-len
    const text1 = type === 'group' ? `Your Simple message is "${data[1]}"` : `Your Simple message is "${data[1]}"`;
    // eslint-disable-next-line max-len
    const text2 = type === 'group' ? `Your message is "${data[2]}", and your link is "${data[3]}"` : `Your message is "${data[2]}", and your link is "${data[3]}"`;
    const text3 = type === 'group' ? `${data[3]}` : `${data[3]}`;
    const text5 = type === 'group' ? `${data[5]}` : `${data[5]}`;
    const text4 = type === 'group' ? `${data[4]}` : `${data[4]}`;
    const text6 = type === 'group' ? `${data[6]}` : `${data[6]}`;
    const text7 = type === 'group' ? `${data[7]}` : `${data[7]}`;

    // If user does not give parameters, send this body and header in message
    if (data.length == 0) {
      reqBody = [{type: 'message', text: 'This is a simple message'}, {
        type: 'message',
        text: 'This is message with a link',
        link: 'https://zoom.us',
      }, {
        type: 'message',
        text: 'This is a message with style',
        style: {color: '#ff0000', bold: 'true', italic: 'true'},
      }];
      reqHeader = {text: 'Multiple Messages'};
      // eslint-disable-next-line brace-style
    }

    // If user provides parameters send this body and header in message
    else {
      // eslint-disable-next-line max-len
      reqBody = [{type: 'message', text: text1}, {type: 'message', text: text2, link: text3}, {
        type: 'message',
        text: text4,
        style: {color: `${text5}`, bold: text6, italic: text7},
      }];
      reqHeader = {text: text};
    }
  }

  // eslint-disable-next-line max-len
  // Configuring the "cards" command. This command displays an example of cards .
  else if (command === 'section') {
    reqBody = [{
      type: 'section',
      sidebar_color: '#FFD700',
      sections: [
        {
          type: 'message',
          text: 'This is a message \n Below is an example of buttons',
        },

        {
          type: 'actions',
          limit: '1',
          items: [
            {
              text: 'Button1',
              style: '',
              value: 'button2',
            },

          ],
        },
      ],
      footer: 'This is a footer',
    }];
    reqHeader = {text: `This message displays sections and Footer`};
    // eslint-disable-next-line brace-style
  }

  // Example showing subhead
  /*
  else if (command === 'subhead') {

    // eslint-disable-next-line max-len
    // eslint-disable-next-line max-len
    // eslint-disable-next-line max-len
    // eslint-disable-next-line max-len
    // eslint-disable-next-line max-len
    const text = type === 'group' ? `Your Title is ${data[0]}` : `Your Title is ${data[0]}`;
    // eslint-disable-next-line no-unused-vars
    const text1 = type === 'group' ? `${data[1]}` : `${data[1]}`;

    // If user does not give parameters, send this body and header in message

    reqBody = [{type: 'message', text: 'This is a simple message'}];
    reqHeader = {text: `This is a Header`};
    reqSubHeader = {text: `This is a SubHeader`};
  }
  */
  else if (command === 'attachments') {
    {
      reqBody = [{
        type: 'attachments',
        resource_url: 'https://docs.google.com/document/d/test/edit?usp=drive_web',
        img_url: 'https://avatars1.githubusercontent.com/u/7495313?v=4',
        size: 3000,
        information: {
          title: {
            text: 'test csv',
          },
        },
      }];
      reqHeader = {text: 'This is an attachment'};
    }
    // eslint-disable-next-line brace-style
  }

  else if (command === 'dropdown') {
    {
      reqBody = [{
        type: 'select',
        text: 'Please select an option',
        style: {
          color: '#987654',
          bold: 'false',
          italic: 'true',
        },
        selected_item: {
          text: 'option 3',
          value: 'v3',
        },
        select_items: [
          {
            text: 'option 1',
            value: 'v1',
          },
          {
            text: 'option 2',
            value: 'v2',
          },
          {
            text: 'option 3',
            value: 'v3',
          },
          {
            text: 'option 3',
            value: 'v4',
          },
        ],
      }];
      reqHeader = {text: 'This is an example of dropdown'};
    }
    // eslint-disable-next-line brace-style
  }

  // If you trigger a wrong command send this body and header in message
  else {
    // eslint-disable-next-line max-len
    const text = type === 'group' ? `Your Command "${command}" is incorrect, so your data, which is "${data}", is also incorrect, type "help" because you need it badly` : `Your Command "${command}" is incorrect, so your data, which is "${data}", is also incorrect, type "help" because you need it badly`;
    reqBody = [{type: 'message', text: text}];
    reqHeader = {text: `You typed a wrong command`};
  }

  // This sends a message from the bot to the user
  userApp.sendMessage(
      {
        to_jid,
        account_id,
        body: reqBody,
        header: reqHeader,
        //  subhead: reqSubHeader
      }).then(function(s) {
    // console.log(s);
  });
});


// eslint-disable-next-line max-len
// Handling the message event, when the ZoomBot receives the '/' command, this method will be invoked
app.all('/message', async function(req, res) {
  try {
    const {body, headers} = req;
    const info=zoomBot.parse({body, headers});
    if (info.status===true) {
      // eslint-disable-next-line no-unused-vars
      const {command, payload, message, type, event}=info.data;
      try {
        zoomBot.handle({body, headers}, function(err) {
          if (err) {
            console.log(err, 'this is an error with /message');
          }
          res.send('ok');
        });
      } catch (e) {
        console.log(e, 6);
        res.send(e);
      }
    } else {
      console.log(info.errorMessage);
    }
  } catch (e) {
    console.log(e, 56);
    res.send(e);
  }
});

// Handling OAuth. This function will be invoked when you attempt oAuth
app.get('/oauth', async function(req, res) {
  // console.log("attempting oauth");
  try {
    // creating connection by using connectByCode)() method
    const connection = await oauth2Client.connectByCode(req.query.code);

    // creating a business instance to handle actions e.g. sendMessage
    userApp = zoomBot.create({auth: connection});
    res.send('ok');
    console.log('oauth complete');
  } catch (e) {
    res.send(e);
  }
});

// eslint-disable-next-line max-len
// Creating a HTTP server that listens to server ports and gives a response back to the client
const server = http.createServer(app);
server.listen(3003, function() {
  console.log(`3003 is opened`);
}
);
