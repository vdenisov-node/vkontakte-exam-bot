// GAVNO

/*
https://www.npmjs.com/package/VK-Promise
*/

const VK = require('VK-Promise')

const processENV = require('./keys.json')

// ************************************************************

const vk = new VK("5c4e27ddfe95665bf390e9d45aa50eec42b13f122631825a4ec6adfce0dddeea8cad701985c55b534d354")

vk.longpoll.start();
 
vk.on("message",function (event, msg) {
    if (msg.body == "ping") {
        msg.send("pong");
    } else {
        msg.send("what ?");
    }
    event.ok();
});

console.log('bot is rinning ...')
console.log('token =>', processENV.TOKEN)
