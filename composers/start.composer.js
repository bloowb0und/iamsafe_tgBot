const { Composer} = require('telegraf');
const dbService = require("../dbService");
const composer = new Composer();

composer.start(async (ctx) => {
    if (ctx.message.chat.type === 'private') {
        await ctx.reply('Вітаю! 👋\n' +
            'Кожен день я буду опитувати, чи ти на зв’язку та де знаходишся, а також показувати узагальнені дані твоїм близьких. 🫂');

        await dbService.insertUser(ctx.message.from.id, ctx.message.from.first_name);

        const groups = await dbService.getGroups();

        for (const group of groups) {
            let chatMember = await ctx.telegram.getChatMember(group.group_tgid, ctx.message.from.id);

            if (chatMember) {
                await dbService.insertGroupToUser(ctx.message.from.id, group.group_tgid);
            }
        }
        // await ctx.scene.enter('checkStateWizard');
    }
});

module.exports = composer;