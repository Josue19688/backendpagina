
// require('dotenv').config();
// import * as TelegramBot  from 'node-telegram-bot-api';


// process.env.NTBA_FIX_319;

// const token:any = process.env.TOKEN;


// const bot = new TelegramBot(token, {polling:true});

// // Listen for any kind of message. There are different kinds of
// // messages.
// bot.on('message', (msg) => {

//     //datos del cliente
//     const chatClienteId = msg.chat.id;
//     const chatFirstName = msg.chat.first_name || '';
//     const chatUsername = msg.chat.username || '';
//     const chatTipo=msg.chat.type;

//     ///Datos del mensaje
//     const fecha = msg.date;
//     const texto = msg.text;

  
//     console.log(msg)
//     // send a message to the chat acknowledging receipt of their message
//     //bot.sendMessage(chatId, 'Received your message');
// });

// bot.onText(/\/reset-password/, (msg) => {
//     const chatClienteId = msg.chat.id;

//     bot.sendMessage(chatClienteId, 'Mensaje de reseteo de contraseña recibido');
    
// });

// export const botLogs =async (data:any) => {
//     const chatId=1960098520;
//     bot.sendMessage(chatId,`${data}`,{parse_mode : "HTML"});
//     return true;
// }

