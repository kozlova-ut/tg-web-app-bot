const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '7380769479:AAEIE7U_Mj4CL48YMAxS6k2F3drUvDQC0lU';
const webAppUrl = 'https://vermillion-axolotl-c5cf22.netlify.app';
const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

console.log('Юлечка');

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {

        await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
            reply_markup: {
                keyboard: [
                    [{
                        text: 'Заполнить форму',
                        web_app: {url: webAppUrl + '/form'}
                    }]
                ]
            }
        });

        await bot.sendMessage(chatId, 'Заходи в наш интернет магазин по кнопке ниже', {
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'Сделать заказ',
                        web_app: { url: webAppUrl }
                    }]
                ]
            }
        });
    }

    if(msg?.web_app_data?.data) {

        try {
            const data = JSON.parse(msg?.web_app_data?.data);

            await bot.sendMessage(chatId, 'Спасибо за обратную связь!');

            setTimeout( async () => {
                await bot.sendMessage(chatId, `
Имя: ${data?.name}
Фамилия: ${data?.surname}
Пол: ${data?.gender}
                `);
            }, 1000)
        } catch (e) {
            console.log(e);
        }
        
    }
});

app.post('/web-data', async (req, res) => {
    const {queryId, totalPrice} = req.body;

    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId, 
            title: 'Успешная покупка',
            input_message_content: {
                message_text: `Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}`
            }
        });

        return res.status(200).json({});

    } catch(e) {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId, 
            title: 'Не удалось приобрести товар',
            input_message_content: {
                message_text: 'Не удалось приобрести товар'
            }
        });
        return res.status(500).json({});
    }    
})

const PORT = 8000;
app.listen(PORT, () => console.log(`server started on PORT ${PORT}`));