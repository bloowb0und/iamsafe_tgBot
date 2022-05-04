const {
    Telegraf,
    Markup,
    Composer,
    Scenes,
    session
} = require('telegraf');
const cron = require('node-cron')
const pollSender = require("./sendPoll");
const botToken = require('./config.json').botToken;

const bot = new Telegraf(botToken);

const stage = new Scenes.Stage([require('./scenes/checkState.scene')]);
bot.use(session());
bot.use(stage.middleware());

bot.use(require('./composers/start.composer'))
bot.use(require('./composers/group.composer'))

// bot.use(require('./composers/hints.composer'))

// send checkState message and enter checkStateWizard on callback_query
bot.action('yesIAmSafe', async (ctx) => {
    await ctx.scene.enter('checkStateWizard');
})

cron.schedule('0 11 * * *', async () => {
        // bot.telegram.sendMessage('181241475', 'THIS MESSAGE SENDS EVERY MINUTE!');
    try {
        await pollSender.sendMessageToGroups(bot);
    } catch (e) {
        console.log(e);
    }
}, {
    scheduled: true,
    timezone: "Europe/Helsinki"
});

bot.launch().then(() => console.log('Bot launched.'));