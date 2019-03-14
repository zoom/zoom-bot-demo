//require ('zoom-bot-sdk');
var express = require('express');
let http = require('http');
var bodyParser = require("body-parser");
let app = express();
app.use(express.static('./TranslateBot/test.html'));
app.use(bodyParser.json());

const { oauth2, client, setting } = require('zoom-bot-sdk');

const to_jid = '1eb8f00546464e86ab3fa8903e7a5c52@conference.xmppdev.zoom.us';
const account_id = 'Uoj5nh68RtK_C737r6XTIw';

setting.setUrl('https://dev.zoom.us'); // if you are in projection,not use this.

let oauth2Client = oauth2(
  'nKZmSkNSSXOxFcVCtB0jaA', //client id
  'cI9PraeqEXzNM0mSYpIh7LHWW9kkJurQ', //client secret
  'http://06ba2623.ngrok.io/oauth' //redirect uri
);


oauth2Client.on('tokens',function(tokens){
  console.log(tokens,999)

})

//create zoomBot
let zoomBot = client(
  'nKZmSkNSSXOxFcVCtB0jaA',//client id
  'wtIceovcROe68qBa_NsDgQ',//verify code
  'v1prfqdonqtjw9e4urow4bca@xmppdev.zoom.us',//jid
  'OjusNewBotTest'
).commands(
[{ command: 'create', description: 'create a new meeting', hint: ' <userName> <date>' },
{ command: 'buttons', description: 'this is an example of buttons', hint: 'Type a message ' },
{ command: 'Cards', description: 'this is an example of cards', hint: 'Type a message ' },
{ command: 'links', description: 'this is links', hint: 'Type a message ' },
{ command: 'form', description: 'this is form', hint: 'Type a message ' },
{ command: 'multiple', description: 'this is an example of multiple messages', hint: 'Type a message ' }]).defaultAuth(oauth2Client.connect());


zoomBot.on('commands', function (e) {
  let { payload, data, type, command, message } = e;//origin message from IM is message
  let { toJid: to_jid, accountId: account_id, name } = payload;
  if (command === 'create') {
    console.log("i have received the command");
    /*
     we format your command string /zoom create foxjiang 2019-08-08 in group chat
     and command==='create' data=['foxjiang','2019-08-08']
    */
    //group explain message from channelList，type==='one' explain message from 1:1 chat
    let text = type === 'group' ? `message user ${data[1]}` : `message user ${data[1]}`;
    //create a new userApp and run,you can store your userApp in your code
    let foxApp = zoomBot.create({ auth: oauth2Client.connect() });
    //replay a message to zoom clinet
    foxApp.sendMessage({
      to_jid,
      account_id,
      body: { type: 'message', text }, header: { text: `reply from ${name}` }
    });
  }
  // else if(command==='delete'){//other command logic}
  else if (command === "buttons") {

    console.log("we are within buttons");

    foxApp.sendMessage({
      to_jid,
      account_id,
      body: [{type: 'actions', limit:'2', items:[{text: 'update', event_id:'update', event:'sendMsg(\"/weather update\")'},{text: 'delete', event_id:'delete', event:'sendMsg(\"/weather delete\")'}]}], header: { text: `This is help, it shows multiple messages` }
    });

  }


  //Configuring the "translate" command
  else if (command === "cards") {

    console.log("we are in cards");

    foxApp.sendMessage({
      to_jid,
      account_id,
      body: { type: 'message', text: 'this is an example of cards', link: 'www.zoom.us' }, header: { text: `reply from ${name}` }
    });

  }


  //Configuring the "link" command. This command displays an example for link.

  else if (command === "links") {

    console.log("we are in links");

    foxApp.sendMessage({
      to_jid,
      account_id,
      body: { type: 'message', text: 'Zoom Video', link: 'www.zoom.us' }, header: { text: `This is an example of links` }
    });

  }


  //Configuring the "form" command. This command displays an example using Form.

  else if (command === "form") {

    console.log("we are within forms");

    foxApp.sendMessage({
      to_jid,
      account_id,
      body: [{type: 'fields', items:[{key:'India', value: 'IND'}, { key:'United States', value: 'USA'}]}], header: { text: `This is help, it shows Form fields` }
    });

  }



  //Configuring the "buttons" command. This command displays an example of buttons command.

  else if (command === "multiple") {

    console.log("we are in multiple");
    foxApp.sendMessage({
      to_jid,
      account_id,
      body: [{ type: 'message', text: 'This is message with a link', link: 'https://zoom.us'}, {type: 'message', text: 'this is a message with style', style: {color: '#ff0000', bold: 'true'}}], header: { text: `This is help, it shows multiple messages` }
    });
  }

  else {
    console.log("you are wrong ");
  }

});


app.all('/message', function (req, res) {//get message api
  let { body, headers } = req;
  //i will add help,
  zoomBot.handle({ body, headers }, function (err) {
    if (err) { console.log(err, "this is an error with /message"); }
    res.send('ok');
  });
});




app.get('/oauth', async function (req, res) {
  try {
    let connection = await oauth2Client.connectByCode(req.query.code);
    //change foxApp to current oauth2 user
    foxApp = zoomBot.create({ auth: connection });
    res.send('ok');
  } catch (e) {
    res.send(e);
  }
});



var server = http.createServer(app);
server.listen(3003, function () { console.log(`3003 is opened`); });
