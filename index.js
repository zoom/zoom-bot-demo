const express = require('express');
const config = require('./config'); // values would be derived from config.js
const http = require('http');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());


const {oauth2, client} = require('zoom-bot-sdk');


// By Default the SDK uses api.zoom.us,
// if you are using Dev credentials, uncomment the below line
// setting.setUrl('https://dev.zoom.us');


// Creating an OAuth2 object with the given configurations,
// you can find these values in the app that you created in Marketplace,
// visit: www.marketplace.zoom.us
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


// creating a zoomBot instance to configure the Help command,
// you can find these values in your application in Marketplace,
// visit: www.marketplace.zoom.us
const zoomBot = client(
    config.clientID, // client id
    config.verifyCode, // verify code
    config.botJid, // jid

    config.botName).commands([{
  command: 'simple :',
  description:
      'When you enter this command you will ' +
      'see an example with a simple message, ' +
      '\nSyntax: "simple" "title" "text"',
},

{
  command: 'actions :',
  description: 'When you enter the "Actions" command, ' +
      'the bot displays two buttons, ' +
      '\nSyntax: actions "title" "button1" "button2"  ',
},

{
  command: 'links :',
  description: 'When you enter this command ' +
      'you will see an example with clickable links, ' +
      '\nSyntax: links "title" "text" "link"',
},
{
  command: 'subhead :',
  description: 'When you enter this command ' +
        'you will see an example with a header and subheader',
},
{
  command: 'fields :',
  description: 'When you enter this command ' +
      'you will see an example with two fields, ' +
      '\nSyntax: fields "title" "key 1" "value 1" "key 2" "value 2" ',
},

{
  command: 'style :',
  description: 'When you enter this command ' +
      'you will see an example of a message and header with style, ' +
      '\nSyntax: "style" "title" "text"',
},

{
  command: 'sections :',
  description: 'When you enter this command ' +
      'you will see an example of sections , ' +
      'i.e Simple Message, Actions, Links and Fields' +
      'there is also an example of footer and the sidebar color is Golden',
},

{
  command: 'editable :',
  description: 'When you enter this command ' +
      'you will see an example of an editable message',
},

{
  command: 'attachments :',
  description: 'When you enter this command ' +
      'you will see an example of a message with an attachment',
},

{
  command: 'dropdown :',
  description: 'When you enter this command ' +
      'you will see an example of a dropdown menu with 3 options',
},

{
  command: 'cards :',
  description: 'When you enter this command ' +
      'you will see three types of examples: ' +
      '\n - a simple message, ' +
      '\n - a message with a clickable link and  ' +
      '\n - a message with style, ' +
      '\nSyntax: cards "title" ' +
      '"text for simple message" ' +
      '"text for link" ' +
      '"link" ' +
      '"text for style" ' +
      '"color in hex format", ' +
      '"Value for Bold, i.e. True / False",' +
      '"Value for Italics, i.e. True / False"',
}]).defaultAuth(oauth2Client.connect());


// This initiates the Zoom Bot
zoomBot.on('commands', function(e) {
  const {payload, data, type, command} = e;// origin message from IM is message
  const {toJid: to_jid, accountId: account_id} = payload;
  let reqBody;
  let reqHeader;

  // Configuring the Actions command, for more information, visit: https://marketplace.zoom.us/docs/guides/guides/building-a-chatbot/Generating-Rich-TextBot-Message-Cards
  if (command === 'actions') {
    const text =
        type ===
        'group' ? `Your Title is ${data[0]}` : `Your Title is ${data[0]}`;
    const text1 = type === 'group' ? `${data[1]}` : `${data[1]}`;
    const text2 = type === 'group' ? `${data[2]}` : `${data[2]}`;

    // If user does not give parameters, send this body and header in message
    if (data.length == 0) {
      reqBody = [{
        type: 'actions',
        limit: '2',
        items: [{
          text: 'Update',
          event_id: 'update',
          event: 'sendMsg(\"/weather update\")',
        },
        {
          text: 'Delete',
          event_id: 'delete',
          event: 'sendMsg(\"/weather delete\")',
        }],
      }];
      reqHeader = {text: 'Actions'};
    }

    // If user provides parameters send this body and header in message
    else {
      reqBody = [{
        type: 'actions',
        limit: '2',
        items:
              [{
                text: text1,
                event_id: 'update',
                event: 'sendMsg(\"/weather update\")',
              },
              {text: text2,
                event_id: 'delete',
                event: 'sendMsg(\"/weather delete\")',
              }],
      }];
      reqHeader = {text: text};
    }
  }
  // Configuring the "simple" command

  else if (command === 'simple') {
    // console.log(reqBody, reqHeader)
    const text =
        type === 'group' ? `Your Title is ${data[0]}` :
            `Your Title is ${data[0]}`;
    const text1 = type === 'group' ? `${data[1]}` : `${data[1]}`;

    // If user does not give parameters, send this body and header in message
    if (data.length == 0) {
      reqBody = [{
        type: 'message',
        text: 'This is a simple message',
      }];
      reqHeader = {text: `Simple Message`};
    }

    // If user provides parameters send this body and header in message
    else {
      reqBody = [{
        type: 'message',
        text: text1}];
      reqHeader = {text: text};
    }
  }

  // Configuring the "editable command"
  else if (command === 'editable') {
    {
      reqBody = [{
        type: 'message',
        text: 'This is an editable message',
        editable: 'true',
      }];
      reqHeader = {
        text: `Editable Message Example`,
      };
    }
  }

  // Configuring the "style" command,
  // This command displays a message with a style

  else if (command === 'style') {
    const text = type === 'group' ? `Your Title is ${data[0]}` :
        `Your Title is ${data[0]}`;
    const text1 = type === 'group' ? `${data[1]}` : `${data[1]}`;

    // If user does not give parameters, send this body and header in message
    if (data.length == 0) {
      reqBody = [{
        type: 'message',
        text: 'This is a message with style',
        style: {color: '#ff0000', bold: 'true', italic: 'true'},
      }];

      reqHeader = {text: `Message with Style`,
        style:
            {
              color: '#ffff00',
              bold: 'true',
              italic: 'true',
            }};
    }

    // If user provides parameters send this body and header in message
    else {
      reqBody = [{
        type: 'message',
        text: text1,
        style:
            {color: '#ff0000',
              bold: 'true',
              italic: 'true',
            },
      }];

      reqHeader = {
        text: text,
        style:
            {
              color: '#ff0000',
              bold: 'true',
              italic: 'true',
            },
      };
    }
  }

  // Configuring the "link" command. This command displays an example for link.

  else if (command === 'links') {
    const text = type === 'group' ? `Your Title is ${data[0]}` :
        `Your Title is ${data[0]}`;
    const text1 = type === 'group' ? `${data[1]}` : `${data[1]}`;
    const text2 = type === 'group' ? `${data[2]}` : `${data[2]}`;

    // If user does not give parameters, send this body and header in message
    if (data.length == 0) {
      reqBody = [{
        type: 'message',
        text: 'https://www.zoom.us',
        link: 'https://www.zoom.us',
      }];
      reqHeader = {text: 'Links'};
    }

    // If user provides parameters send this body and header in message
    else {
      reqBody = [{
        type: 'message',
        text: text1,
        link: text2,
      }];
      reqHeader = {text: text};
    }
  }

  // Configuring the "fields" command.
  // This command displays an example using fields.

  else if (command === 'fields') {
    const text = type === 'group' ? `Your Title is ${data[0]}` :
        `Your Title is ${data[0]}`;
    const text1 = type === 'group' ? `${data[1]}` : `${data[1]}`;
    const text2 = type === 'group' ? `${data[2]}` : `${data[2]}`;
    const text3 = type === 'group' ? `${data[3]}` : `${data[3]}`;
    const text4 = type === 'group' ? `${data[4]}` : `${data[4]}`;

    // If user does not give parameters, send this body and header in message
    if (data.length == 0) {
      reqBody = [{
        type: 'fields',

        items: [{
          key: 'Zoom',
          value: 'USA',
          editable: 'true',
        },
        {
          key: 'San Jose',
          value: 'California',
        }],
      }];
      reqHeader = {text: 'Fields'};
    }

    // If user provides parameters send this body and header in message
    else {
      reqBody = [{
        type: 'fields',
        items: [{
          key: text1,
          value: text2,
        },
        {
          key: text3,
          value: text4}],
      }];
      reqHeader = {text: text};
    }
  }


  // Configuring the "cards" command.
  // This command displays an example of cards .

  else if (command === 'cards') {
    const text = type === 'group' ? `Your Title is ${data[0]}` :
        `Your Title is ${data[0]}`;
    const text1 = type === 'group' ? `Your Simple message is "${data[1]}"` :
        `Your Simple message is "${data[1]}"`;
    const text2 =
        type ===
        'group' ? `Your message is "${data[2]}", 
        and your link is "${data[3]}"` :
        `Your message is "${data[2]}", and your link is "${data[3]}"`;
    const text3 = type === 'group' ? `${data[3]}` : `${data[3]}`;
    const text5 = type === 'group' ? `${data[5]}` : `${data[5]}`;
    const text4 = type === 'group' ? `${data[4]}` : `${data[4]}`;
    const text6 = type === 'group' ? `${data[6]}` : `${data[6]}`;
    const text7 = type === 'group' ? `${data[7]}` : `${data[7]}`;

    // If user does not give parameters, send this body and header in message
    if (data.length == 0) {
      reqBody = [{
        type: 'message',
        text: 'This is a simple message',
      },
      {
        type: 'message',
        text: 'This is message with a link',
        link: 'https://www.zoom.us',
      },
      {
        type: 'message',
        text: 'This is a message with style',
        style: {
          color: '#ff0000',
          bold: 'true',
          italic: 'true',
        },
      }];
      reqHeader = {text: 'Multiple Messages'};
    }

    // If user provides parameters send this body and header in message
    else {
      reqBody = [{
        type: 'message',
        text: text1,
      },
      {
        type: 'message',
        text: text2,
        link: text3},
      {
        type: 'message',
        text: text4,
        style: {
          color: `${text5}`,
          bold: text6,
          italic: text7,
        },
      }];
      reqHeader = {text: text};
    }
  }

  // Configuring the "cards" command.
  // This command displays an example of cards .
  else if (command === 'section') {
    reqBody = [{
      type: 'section',
      sidebar_color: '#FFD700',
      sections: [
        {
          type: 'message',
          text: 'This is a message ',
        },

        {
          type: 'actions',
          limit: '1',
          items: [
            {
              text: 'Button',
              value: 'Button',
            },

          ],
        },
        {
          type: 'message',
          text: 'This is message with a link',
          link: 'https://www.zoom.us',
        },

        {
          type: 'fields',
          text: 'This is fields',

          items: [
            {
              key: 'Zoom',
              value: 'USA',
              editable: 'true',
            },
            {
              key: 'San Jose',
              value: 'California',
            }],
        },
      ],
      footer: 'This is a footer',
      footer_icon: 'https://d24cgw3uvb9a9h.cloudfront.net/static/93516/image/new/ZoomLogo.png',
    }];
    reqHeader = {text: `This message displays sections and Footer`};
  }

  // Example showing subhead

  else if (command === 'subhead') {
    reqBody = [{type: 'message', text: 'This is a simple message'}];

    reqHeader = {
      text: 'This is the Header ',
      sub_head: {text: 'This is a Subheader'},
    };
  }

  // Example Showing Attachments
  else if (command === 'attachments') {
    {
      reqBody = [{
        type: 'attachments',
        resource_url: 'https://zoom.us/docs/doc/Conference_Room_Solutions.pdf',
        img_url: 'https://ruanshi2.8686c.com/static/93525/image/new/ZoomLogo.png',
        size: 3000,
        information: {
          title: {
            text: 'Zoom - Making Video Communications Frictionless',
          },
        },
      }];
      reqHeader = {text: 'This is an attachment'};
    }
  }

  // Example Showing DropDown
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
            text: 'option 4',
            value: 'v4',
          },
        ],
      }];
      reqHeader = {text: 'This is an example of dropdown'};
    }
  }

  // If you trigger a wrong command send this body and header in message
  else {
    const text =
        type === 'group' ?
            `Your Command "${command}" is incorrect, 
            so your data, which is "${data}", 
            is also incorrect, type "help" because you need it badly` :
            `Your Command "${command}" 
            is incorrect, so your data, which is "${data}", 
            is also incorrect, type "help" because you need it badly`;
    reqBody = [{
      type: 'message',
      text: text}];
    reqHeader = {
      text: `You typed a wrong command`,
    };
  }

  // This sends a message from the bot to the user
  userApp.sendMessage(
      {
        to_jid,
        account_id,
        body: reqBody,
        header: reqHeader,
      }).then(function(s) {
    // console.log(s);
  });
});


// Handling the message event,
// when the ZoomBot receives the '/' command, this method will be invoked

app.all('/message', async function(req, res) {
  try {
    const {body, headers} = req;
    const info=zoomBot.parse({body, headers});
    if (info.status===true) {
      const {
        command, payload, message, type, event,
      }=info.data;
      try {
        zoomBot.handle(
            {
              body, headers,
            }, function(err) {
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


// Creating a HTTP server that listens to server ports
// and gives a response back to the client
const server = http.createServer(app);
server.listen(3003, function() {
  console.log(`3003 is opened`);
}
);
