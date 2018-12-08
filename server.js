const https = require('https');
const request = require('request');
const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

const DATAMALL_URL = 'https://api.data.gov.sg/v1/transport/traffic-images';

const CAMERA_NAME = {
  "4703": "Tuas Checkpoint 1",
  "4713": "Tuas Checkpoint 2",
  "2701": "Woodlands Checkpoint 1",
  "2702": "Woodlands Checkpoint 2"
};

const CAMERA_ID = Object.keys(CAMERA_NAME);

console.log("Initialzing Bot")
bot.start((ctx) => ctx.reply('Welcome to CausewayBot! You can use the inline search function @CausewayBot'));
bot.on('text', (ctx) => {
  
});

bot.on('inline_query', ({ inlineQuery, answerInlineQuery }) => {
  let API = DATAMALL_URL;
  if(inlineQuery.query.length == 19) {
    API += `?date_time=${encodeURIComponent(inlineQuery.query)}`
  }
    
  request(API, (error, response, body) => {
    let results = [];

    body = JSON.parse(body).items[0];
    const timestamp = new Date(body.timestamp);
    body.cameras.forEach((camera) => {
      if(CAMERA_ID.includes(camera.camera_id)) {
        results.push({
          type: "photo",
          id: `${camera.camera_id}${timestamp}`,
          caption: `*${CAMERA_NAME[camera.camera_id]}*\n_${timestamp.getFullYear()}-${timestamp.getMonth()}-${timestamp.getDate()} ${timestamp.getHours()+8}:${timestamp.getMinutes()}:${timestamp.getSeconds()} GMT+8_`,
          parse_mode: 'Markdown',
          photo_url: camera.image,
          thumb_url: camera.image
        });
      }
    });

    answerInlineQuery(results, {
       cache_time: 60 
    });
  });
  
});

bot.startPolling();
