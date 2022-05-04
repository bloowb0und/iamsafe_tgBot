const { Composer, Markup} = require('telegraf');
const dbService = require("../dbService");
const composer = new Composer();

composer.on('my_chat_member', async (ctx) => {
    if(ctx.update.my_chat_member.new_chat_member.user.username === 'iamsafe_bot'
        && ctx.update.my_chat_member.new_chat_member.status === 'left' || ctx.update.my_chat_member.new_chat_member.status === 'kicked')
    {
        console.log('bot left');
        await dbService.deleteGroup(ctx.update.my_chat_member.chat.id);
        return;
    }

    if(ctx.update.my_chat_member.new_chat_member.user.username === 'iamsafe_bot'
        && (ctx.update.my_chat_member.new_chat_member.status === 'member' || ctx.update.my_chat_member.new_chat_member.status === 'administrator'))
    {
        if((await dbService.getGroupByTelegramId(ctx.update.my_chat_member.chat.id)).length < 1)
        {
            await dbService.insertGroup(ctx.update.my_chat_member.chat.id, ctx.update.my_chat_member.chat.title);
        }

        if(ctx.update.my_chat_member.new_chat_member.status === 'member')
        {
            await ctx.reply(`За допомогою мене ви будете знати, чи все гаразд у кожного з вас, а також, де ви знаходитесь\\.
Один раз на день я буду опитувати, чи всі на зв’язку та де знаходяться, а також показувати отримані дані

🟢 **Щоб я почав працювати, зроби мене адміністратором цієї групи \\(Редагувати групу \\-\\> Адміністратор\\)\\.

Github мого творця: [bloowb0und](https://github.com/bloowb0und)`, {
                parse_mode: 'MarkdownV2',
                disable_web_page_preview: true,
            })
        }

        if(ctx.update.my_chat_member.new_chat_member.status === 'administrator')
        {
            await ctx.reply('Натисніть кнопку перейти до бота і натисніть "Почати", щоб отримувати повідомлення 👇', {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [Markup.button.url('Почати', 'https://t.me/iamsafe_bot')],
                ])
            })
        }
    }
});

composer.on('left_chat_member', async (ctx) => {
    console.log(`user left from ${ctx.update.message.chat.title}`)
    try {
        await dbService.deleteGroupFromUser(ctx.update.message.from.id, ctx.update.message.chat.id)
    } catch (e) {
        console.log(e);
    }
});

module.exports = composer;