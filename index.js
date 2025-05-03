require("dotenv").config();
const token = process.env.TELEGRAM_BOT_TOKEN;

const TelegramBot = require("node-telegram-bot-api");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("messages.db");

//create the bot using the token
const bot = new TelegramBot(token, { polling: true });

//initialize the database
db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

//handle incoming messages
bot.on('message',(msg)=>{
    const userId=msg.from.id;
    const text=msg.text;

    db.run(`INSERT INTO messages (user_id,message) VALUES (?,?)`,[userId,text], (err)=>{
        if(err) {
            console.error('DB error:',err.message);
        } else{
            console.log(`Message saved to DB from user:${userId}: ${text}`);
        }
    });

    //send a response
    bot.sendMessage(msg.chat.id,`Got it! saved the note ;)`);
});

