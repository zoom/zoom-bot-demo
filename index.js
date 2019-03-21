var express = require('express');
let http = require('http');
var bodyParser = require("body-parser");
let app = express();
//app.use(express.static('./test'));
app.use(bodyParser.json());

const { oauth2, client, setting } = require('zoom-bot-sdk');

const to_jid = '8a9e9742c71a4371829d2acc1b24f646@conference.xmpp.zoom.us';//config.to_jid;
const account_id = 'J5yuBxbFT0iKHvOh1iR3Rg';//config.account_id;

//setting.setUrl('https://api.zoom.us'); // if you are in projection,not use this.

let oauth2Client = oauth2(
  'uhdF1HUjSomSeXamTnvQw',//config.clientID, //client id
  'ufpPgU8dso5SLNtj2BFXY81GisgW2qaL',//config.clientSecret, //client secret
  'http://e28fa870.ngrok.io/oauth',//config.redirect_uri //redirect uri
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
  'uhdF1HUjSomSeXamTnvQw',//config.clientID,//client id
  'B1pSdOz4Q9SRYjTmj6xlLg',//config.verifyCode,//verify code
  'v13-ohvxvbtr6uljiqmcji2a@xmpp.zoom.us',//config.botJid,//jid
  'ZoomTestBot2').commands([{ command: 'create', description: 'create a new meeting', hint: ' <userName> <date>' },
{ command: 'buttons', description: 'this is an example of buttons', hint: 'Type a message ' },
{ command: 'Cards', description: 'this is an example of cards', hint: 'Type a message ' },
{ command: 'links', description: 'this is links', hint: 'Type a message ' },
{ command: 'form', description: 'this is form', hint: 'Type a message ' },
{ command: 'multiple', description: 'this is an example of multiple messages', hint: 'Type a message ' }]).defaultAuth(oauth2Client.connect());



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

    reqBody =  [{ type: 'message', text },{ type: 'message', text:"JSON =", style: {color: '#000080', bold: 'true'} },{ type: 'message', text:myJSON }];
    reqHeader= { text: `reply from ${name}` };

    console.log("JSON =",myJSON);
  }
  // else if(command==='delete'){//other command logic}
  else if (command === "buttons") {

    console.log("we are within buttons");

  reqBody =  [{type: 'actions', limit:'2', items:[{text: 'update', event_id:'update', event:'sendMsg(\"/weather update\")'},{text: 'delete', event_id:'delete', event:'sendMsg(\"/weather delete\")'}]}, { type: 'message', text:"JSON =", style: {color: '#000080', bold: 'true'} },{ type: 'message', text:myJSON }];
  reqHeader = { text: 'This is an example of buttons' };

}


  //Configuring the "translate" command
  else if (command === "cards") {

    console.log("we are in cards");
    //console.log(JSON.stringify(body));


  reqBody = [{ type: 'message', text: 'this is an example of cards', link: 'www.zoom.us'},{ type: 'message', text:"JSON =", style: {color: '#000080', bold: 'true'} },{ type: 'message', text:myJSON }];
  reqHeader = { text: `reply from ${name}` };

  }


  //Configuring the "link" command. This command displays an example for link.

  else if (command === "links") {

    console.log("we are in links");


      reqBody = [{ type: 'message', text: 'Zoom Video', link: 'www.zoom.us'}, { type: 'message', text:"JSON =", style: {color: '#000080', bold: 'true'} },{ type: 'message', text:myJSON }];
      reqHeader ={ text: `This is an example of links` };

  }


  //Configuring the "form" command. This command displays an example using Form.

  else if (command === "form") {

    console.log("we are within forms");


    reqBody = [{type: 'fields', items:[{key:'India', value: 'IND'}, { key:'United States', value: 'USA'}]},{ type: 'message', text:"JSON =", style: {color: '#000080', bold: 'true'} }, { type: 'message', text:myJSON }];
    reqHeader = { text: `This is an example of Form fields` };

  }



  //Configuring the "buttons" command. This command displays an example of buttons command.

  else if (command === "multiple") {

    console.log("we are in multiple");

    reqBody = [{ type: 'message', text: 'This is message with a link', link: 'https://zoom.us'}, {type: 'message', text: 'this is a message with style', style: {color: '#ff0000', bold: 'true'}},{ type: 'message', text:"JSON =", style: {color: '#000080', bold: 'true'} }, { type: 'message', text:myJSON }];
    reqHeader = { text: `This is an example of multiple messages` };


  }

  else {
    console.log("you are wrong ");
    reqBody = [{ type: 'message', text: 'You typed a wrong command'}, { type: 'message', text:"JSON =", style: {color: '#000080', bold: 'true'} },{ type: 'message', text:myJSON }];
    reqHeader = { text: `Your Life is a lie` };
  }

  foxApp.sendMessage({
    to_jid,
    account_id,
    body: reqBody,
    header: reqHeader
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
