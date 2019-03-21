const config = require('./config');
var express = require('express');
let http = require('http');
var bodyParser = require("body-parser");
let app = express();
//app.use(express.static('./test'));
app.use(bodyParser.json());

const { oauth2, client, setting } = require('zoom-bot-sdk');

const to_jid = config.tojid;
const account_id = config.account_id;

//setting.setUrl('https://api.zoom.us'); // if you are in projection,not use this.

let oauth2Client = oauth2(
  config.clientID, //client id
  config.clientSecret, //client secret
  config.redirect_uri //redirect uri
);

let tokens;
oauth2Client.on('tokens',function(tokens2){

  tokens = tokens2;
  console.log(tokens2,999)

})
function refreshTokenIfExpired(tokens){
  if(tokens.expires_in <= 0){
    oauth2Client.on('tokens',function(tokens2){

      tokens = tokens2;
      console.log ("requesting new token");
      console.log(tokens2,999);

    });
  }

}


//create zoomBot
let zoomBot = client(
  config.clientID,//client id
  config.verifyCode,//verify code
  config.botJid,//jid
  config.botName).commands([{ command: 'Create :', hint: 'This command allows you to create a new message', description: 'To create a new message, type "create", "message name", "date"'},
{ command: 'Actions :', hint: 'This command will display an example of actions', description: 'When you enter the "Actions" command, the bot displays two buttons' },
{ command: 'Cards :', hint: 'This command will display an example of cards', description: 'When you enter this command you will see an example with clickable links' },
{ command: 'Links :', hint: 'This command will display an example of links', description: 'When you enter this command you will see an example with clickable links' },
{ command: 'Fields :', hint: 'This command will display an example of fields', description: 'When you enter this command you will see an example with two fields ' },
{ command: 'Multiple :', hint: 'This command will display an example of multiple messages', description: 'When you enter this command you will see an example with a link and then a message with style' }]).defaultAuth(oauth2Client.connect());



zoomBot.on('commands', function (e) {
  let { payload, data, type, command, message } = e;//origin message from IM is message
  let { toJid: to_jid, accountId: account_id, name } = payload;
  var myJSON = JSON.stringify(e);

  //refreshTokenIfExpired(tokens);
  oauth2Client.on('tokens',function(tokens2){

    tokens = tokens2;
    console.log(tokens2,999);

  });

  //var nJSON = function(e);
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

    reqBody =  { type: 'message',text};
    reqHeader= { text: `reply from ${name}`};

    reqBody1 = { type: 'message', text:myJSON };
    reqHeader1 = { text: 'Here is JSON to create Message'};

    console.log("JSON =",myJSON);
  }
  // else if(command==='delete'){//other command logic}
  else if (command === "actions") {

    console.log("we are within Actions");

  reqBody =  [{type: 'actions', limit:'2', items:[{text: 'update', event_id:'update', event:'sendMsg(\"/weather update\")'},{text: 'delete', event_id:'delete', event:'sendMsg(\"/weather delete\")'}]}];
  reqHeader = { text: 'This is an example of Actions' };

  reqBody1 = { type: 'message', text:myJSON };
  reqHeader1 = { text: 'Here is JSON for Actions'};

}


  //Configuring the "translate" command
  else if (command === "cards") {

    console.log("we are in cards");
    //console.log(JSON.stringify(body));


  reqBody = [{ type: 'message', text: 'this is an example of cards', link: 'www.zoom.us'}];
  reqHeader = { text: `reply from ${name}` };

  reqBody1 = { type: 'message', text:myJSON };
  reqHeader1 = { text: 'Here is JSON for Cards'};

  }


  //Configuring the "link" command. This command displays an example for link.

  else if (command === "links") {

    console.log("we are in links");


      reqBody = [{ type: 'message', text: 'Zoom Video', link: 'www.zoom.us'}];
      reqHeader ={ text: `This is an example of links` };

      reqBody1 = { type: 'message', text:myJSON };
      reqHeader1 = { text: 'Here is JSON for Links'};

  }


  //Configuring the "form" command. This command displays an example using Form.

  else if (command === "fields") {

    console.log("we are within fields");


    reqBody = [{type: 'fields', items:[{key:'Zoom Video Communications', value: 'Zoom'}, { key:'San Jose, California', value: 'SJC'}]}];
    reqHeader = { text: `This is an example of Form fields` };

    reqBody1 = { type: 'message', text:myJSON };
    reqHeader1 = { text: 'Here is JSON for Fields'};

  }



  //Configuring the "buttons" command. This command displays an example of buttons command.

  else if (command === "multiple") {

    console.log("we are in multiple");

    reqBody = [{ type: 'message', text: 'This is message with a link', link: 'https://zoom.us'}, {type: 'message', text: 'this is a message with style', style: {color: '#ff0000', bold: 'true'}}];
    reqHeader = { text: `This is an example of multiple messages` };

    reqBody1 = { type: 'message', text:myJSON };
    reqHeader1 = { text: 'Here is JSON for Multiple Messages'};


  }

  else {
    console.log("you are wrong ");
    reqBody = [{ type: 'message', text: 'You typed a wrong command'}];
    reqHeader = { text: `Your Life is a lie` };

    reqBody1 = { type: 'message', text:myJSON };
    reqHeader1 = { text: 'Here is JSON, Even though your life is a lie'};
  }

  foxApp.sendMessage({
    to_jid,
    account_id,
    body: reqBody,
    header: reqHeader
  }).then(function (s){
    console.log(s);
  }, function (e){
    console.log(e);
  });

  foxApp.sendMessage({
    to_jid,
    account_id,
    body: reqBody1,
    header: reqHeader1
  }).then(function (s){
    console.log(s);
  }, function (e){
    console.log(e);
  });
  console.log(myJSON);

});

app.all('/message',function (req, res) {//get message api
  try{
    let { body, headers } = req;
  //i will add help,
  zoomBot.handle({ body, headers }, function (err) {
    if (err) { console.log(err, "this is an error with /message"); }
    res.send('ok');
  });
} catch (e){
  res.send(e);
}
});




app.get('/oauth', async function (req, res) {
  console.log("attempting oauth");
  try {
    let connection = await oauth2Client.connectByCode(req.query.code);
    //change foxApp to current oauth2 user
    foxApp = zoomBot.create({ auth: connection });
    res.send('ok');
    console.log("oauth complete");
  } catch (e) {
    res.send(e);
  }
});



var server = http.createServer(app);
server.listen(3003, function () { console.log(`3003 is opened`); });
