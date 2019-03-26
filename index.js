const config = require('./config');
var express = require('express');
let http = require('http');
var bodyParser = require("body-parser");
var readline = require('readline-sync');


let app = express();
//app.use(express.static('./test'));
app.use(bodyParser.json());

const { oauth2, client, setting } = require('zoom-bot-sdk');

//const to_jid = config.tojid;
//const account_id = config.account_id;

//setting.setUrl('https://api.zoom.us'); // if you are in projection,not use this.

let oauth2Client = oauth2(
  config.clientID, //client id
  config.clientSecret, //client secret
  config.redirect_uri, //redirect uri
  config.to_jid, //Channel ID
  config.account_id //Account ID
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
  config.botName).commands([{ command: 'Actions :', description: 'When you enter the "Actions" command, the bot displays two buttons, \nSyntax: actions "title" "button1" "button2"  ' },
{ command: 'Links :', description: 'When you enter this command you will see an example with clickable links, \nSyntax: links "title" "text" "link"' },
{ command: 'Fields :',  description: 'When you enter this command you will see an example with two fields, \nSyntax: fields "title" "key 1" "value 1" "key 2" "value 2" ' },
{ command: 'Cards :',  description: 'When you enter this command you will see three types of examples: \n - a simple message, \n - a message with a clickable link and  \n - a message with style, \nSyntax: cards "title" "text for simple message" "text for link" "link" "text for style"' }]).defaultAuth(oauth2Client.connect());



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

//console.log(command, text);  // else if(command==='delete'){//other command logic}
 if (command === "actions") {

    console.log("we are within Actions");


  let text = type === 'group' ? `Your Title is ${data[0]}` : `Your Title is ${data[0]}`;
  let text1 = type === 'group' ? `${data[1]}` : `${data[1]}`;
  let text2 = type === 'group' ? `${data[2]}` : `${data[2]}`;

  reqBody =  [{type: 'actions', limit:'2', items:[{text: text1, event_id:'update', event:'sendMsg(\"/weather update\")'},{text:text2 , event_id:'delete', event:'sendMsg(\"/weather delete\")'}]}];
  reqHeader = { text: text};

  reqBody1 = { type: 'message', text:myJSON };
  reqHeader1 = { text: 'Here is JSON for Actions'};

}


  //Configuring the "translate" command
  /*else if (command === "cards") {

    console.log("we are in cards");
    //console.log(JSON.stringify(body));


  reqBody = [{ type: 'message', text: 'this is an example of cards', link: 'www.zoom.us'}];
  reqHeader = { text: `reply from ${name}` };

  reqBody1 = { type: 'message', text:myJSON };
  reqHeader1 = { text: 'Here is JSON for Cards'};

}*/


  //Configuring the "link" command. This command displays an example for link.

  else if (command === "links") {

    console.log("we are in links");


    let text = type === 'group' ? `Your Title is ${data[0]}` : `Your Title is ${data[0]}`;
    let text1 = type === 'group' ? `${data[1]}` : `${data[1]}`;
    let text2 = type === 'group' ? `${data[2]}` : `${data[2]}`;

      reqBody = [{ type: 'message', text: text1, link: text2}];
      reqHeader ={ text: text };

      reqBody1 = { type: 'message', text:myJSON };
      reqHeader1 = { text: 'Here is JSON for Links'};

  }


  //Configuring the "form" command. This command displays an example using Form.

  else if (command === "fields") {

    console.log("we are within fields");

    let text = type === 'group' ? `Your Title is ${data[0]}` : `Your Title is ${data[0]}`;
    let text1 = type === 'group' ? `${data[1]}` : `${data[1]}`;
    let text2 = type === 'group' ? `${data[2]}` : `${data[2]}`;
    let text3 = type === 'group' ? `${data[3]}` : `${data[3]}`;
    let text4 = type === 'group' ? `${data[4]}` : `${data[4]}`;


    reqBody = [{type: 'fields', items:[{key:text1, value: text2}, { key:text3, value: text4}]}];
    reqHeader = { text: text };

    reqBody1 = { type: 'message', text:myJSON };
    reqHeader1 = { text: 'Here is JSON for Fields'};

  }



  //Configuring the "buttons" command. This command displays an example of buttons command.

  else if (command === "cards") {

    console.log("we are in multiple");

    let text = type === 'group' ? `Your Title is ${data[0]}` : `Your Title is ${data[0]}`;
    let text1 = type === 'group' ? `${data[1]}` : `${data[1]}`;
    let text2 = type === 'group' ? `Your message is ${data[2]}, and your link is ${data[3]}` : `Your message is ${data[2]}, and your link is ${data[3]}`;
    let text3 = type === 'group' ? `${data[3]}` : `${data[3]}`;
    let text4 = type === 'group' ? `${data[4]}` : `${data[4]}`;


    reqBody = [{ type: 'message', text: text1}, { type: 'message', text: text2, link: text3}, {type: 'message', text: text4, style: {color: '#ff0000', bold: 'true'}}];
    reqHeader = { text: text };

    reqBody1 = { type: 'message', text:myJSON };
    reqHeader1 = { text: 'Here is JSON for Multiple Messages'};


  }

  else {
    console.log("you are wrong ");
    reqBody = [{ type: 'message', text: 'You typed a wrong command'}];
    reqHeader = { text: `Your Life is a lie and doesn't have any titles` };

    reqBody1 = { type: 'message', text:myJSON };
    reqHeader1 = { text: 'Here is JSON, Even though your life is a lie'};
  }

  //let newmsg =(

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

//);
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

app.all('/message', async function (req, res) {//get message api
  try{
    let { body, headers } = req;
  //i will add help,
  let info=zoomBot.parse({body,headers});
  if(info.status===true){
    let {command,payload,message,type,event}=info.data;
    try{
  zoomBot.handle({ body, headers }, function (err) {
    if (err) { console.log(err, "this is an error with /message"); }
    res.send('ok');
  });
} catch (e){
  res.send(e);
}
}
} catch (e){ //
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
