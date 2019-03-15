//require ('zoom-bot-sdk');
var express = require('express');
let http = require('http');
var bodyParser = require("body-parser");
let app = express();
app.use(express.static('./TranslateBot/test.html'));
app.use(bodyParser.json());

const { oauth2, client, setting } = require('zoom-bot-sdk');

const to_jid = '1eb8f00546464e86ab3fa8903e7a5c52@xmppdev.zoom.us';
const account_id = 'Uoj5nh68RtK_C737r6XTIw';

setting.setUrl('https://dev.zoom.us'); // if you are in projection,not use this.

let oauth2Client = oauth2(
  '3j3xdfsIQ4eEnz0CyILVA', //client id
  'BUekVr4S4j2lxkDWkE1HLWaV6AisoVQ6', //client secret
  'http://8d10eb12.ngrok.io/oauth' //redirect uri
);


oauth2Client.on('tokens',function(tokens){
  console.log(tokens,999)

})

//create zoomBot
let zoomBot = client(
  '3j3xdfsIQ4eEnz0CyILVA',//client id
  'mCAKaf5WTridRGWfbcX-Ng',//verify code
  'v14h6rvt8qqqiylxhnv5gdkq@xmppdev.zoom.us',//jid
  'OjusNewCB').commands([{ command: 'create', description: 'create a new meeting', hint: ' <userName> <date>' },
{ command: 'buttons', description: 'this is an example of buttons', hint: 'Type a message ' },
{ command: 'Cards', description: 'this is an example of cards', hint: 'Type a message ' },
{ command: 'links', description: 'this is links', hint: 'Type a message ' },
{ command: 'form', description: 'this is form', hint: 'Type a message ' },
{ command: 'multiple', description: 'this is an example of multiple messages', hint: 'Type a message ' }]).defaultAuth(oauth2Client.connect());


zoomBot.on('commands', function (e) {
  let { payload, data, type, command, message } = e;//origin message from IM is message
  let { toJid: to_jid, accountId: account_id, name } = payload;
  var myJSON = JSON.stringify(e);
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
      body: [{ type: 'message', text },{ type: 'message', text:"JSON =", style: {color: '#000080', bold: 'true'} },{ type: 'message', text:myJSON }], header: { text: `reply from ${name}` }
    });
    console.log("JSON =",myJSON);
  }
  // else if(command==='delete'){//other command logic}
  else if (command === "buttons") {

    console.log("we are within buttons");

    foxApp.sendMessage({
      to_jid,
      account_id,
      body: [{type: 'actions', limit:'2', items:[{text: 'update', event_id:'update', event:'sendMsg(\"/weather update\")'},{text: 'delete', event_id:'delete', event:'sendMsg(\"/weather delete\")'}]}, { type: 'message', text:"JSON =", style: {color: '#000080', bold: 'true'} },{ type: 'message', text:myJSON }], header: { text: 'This is an example of buttons' }
    });
    console.log(myJSON);

  }


  //Configuring the "translate" command
  else if (command === "cards") {

    console.log("we are in cards");
    //console.log(JSON.stringify(body));

    foxApp.sendMessage({
      to_jid,
      account_id,
      body: [{ type: 'message', text: 'this is an example of cards', link: 'www.zoom.us'},{ type: 'message', text:"JSON =", style: {color: '#000080', bold: 'true'} },{ type: 'message', text:myJSON }], header: { text: `reply from ${name}` }
    });
    console.log(myJSON);

  }


  //Configuring the "link" command. This command displays an example for link.

  else if (command === "links") {

    console.log("we are in links");

    foxApp.sendMessage({
      to_jid,
      account_id,
      body: [{ type: 'message', text: 'Zoom Video', link: 'www.zoom.us'}, { type: 'message', text:"JSON =", style: {color: '#000080', bold: 'true'} },{ type: 'message', text:myJSON }], header: { text: `This is an example of links` }
    });
     console.log(myJSON);
  }


  //Configuring the "form" command. This command displays an example using Form.

  else if (command === "form") {

    console.log("we are within forms");

    foxApp.sendMessage({
      to_jid,
      account_id,
      body: [{type: 'fields', items:[{key:'India', value: 'IND'}, { key:'United States', value: 'USA'}]},{ type: 'message', text:"JSON =", style: {color: '#000080', bold: 'true'} }, { type: 'message', text:myJSON }], header: { text: `This is an example of Form fields` }
    });
     console.log(myJSON);
  }



  //Configuring the "buttons" command. This command displays an example of buttons command.

  else if (command === "multiple") {

    console.log("we are in multiple");
    foxApp.sendMessage({
      to_jid,
      account_id,
      body: [{ type: 'message', text: 'This is message with a link', link: 'https://zoom.us'}, {type: 'message', text: 'this is a message with style', style: {color: '#ff0000', bold: 'true'}},{ type: 'message', text:"JSON =", style: {color: '#000080', bold: 'true'} }, { type: 'message', text:myJSON }], header: { text: `This is an example of multiple messages` }
    });
    console.log(myJSON);
  }

  else {
    console.log("you are wrong ");
    foxApp.sendMessage({
      to_jid,
      account_id,
      body: [{ type: 'message', text: 'You typed a wrong command'}, { type: 'message', text:"JSON =", style: {color: '#000080', bold: 'true'} },{ type: 'message', text:myJSON }], header: { text: `Your Life is a lie` }
    });
    console.log(myJSON);
  }

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
