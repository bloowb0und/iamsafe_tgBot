const {Markup} = require("telegraf");
const dbService = require("./dbService");

module.exports = class PollSender {
    static async sendMessageToGroups(bot) {

        const curDate = `${new Date().getUTCFullYear()}/${new Date().getUTCMonth() + 1}/${new Date().getUTCDate()}`;
        const answeredToday = (await dbService.getUserChecksByDate(curDate));
        const groups = (await dbService.getGroups());

        const usersWithSentChecks = [];

        for (const group of groups) {

            const msgText = await this.getMessageContent(bot, group.group_tgid, curDate, answeredToday);

            const pollMsgId = await bot.telegram.sendMessage(group.group_tgid, msgText, {
                parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                    [Markup.button.url('Почати', 'https://t.me/iamsafe_bot')],
                ])
            });

            const groupUsers = await dbService.getUsersWithGroup(group.group_tgid);

            await dbService.addPollToGroup(pollMsgId.message_id, group.group_tgid);

            for(const user of groupUsers) {
                const chatId = user.user_tgid;
                if(!usersWithSentChecks.includes(chatId)) {
                    await bot.telegram.sendMessage(chatId, `Привіт!\nВи на зв'язку? 📱`, {
                        parse_mode: 'HTML',
                        ...Markup.inlineKeyboard([
                            Markup.button.callback('Так ✅', 'yesIAmSafe')
                        ])
                    });
                    usersWithSentChecks.push(chatId);
                }
            }
        }
    }

    static async editGroupPoll(bot, groupId)
    {
        const curDate = `${new Date().getUTCFullYear()}/${new Date().getUTCMonth() + 1}/${new Date().getUTCDate()}`;
        const answeredToday = (await dbService.getUserChecksByDate(curDate));

        const msgText = await this.getMessageContent(bot, groupId, curDate, answeredToday);
        const chatId = ((await dbService.getGroupByTelegramId(groupId))[0].group_pollsMsgIds.slice(-1))[0]; // get latest poll msg id

        await bot.telegram.editMessageText(groupId, chatId, null, msgText, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [Markup.button.url('Почати', 'https://t.me/iamsafe_bot')],
            ])
        });
    }

    static async getMessageContent(bot, groupTgId, curDate, answeredToday) {
        const groupRegisteredUsers = (await dbService.getUsersWithGroup(groupTgId));
        const amountInGroup = await bot.telegram.getChatMembersCount(groupTgId) - 1; // chat members without bot
        const amountConnected = groupRegisteredUsers.length;
        const amountAnswered = answeredToday.length;

        const skipped = await dbService.getNotContactedUsers(groupRegisteredUsers, answeredToday);

        const answeredGroupByPlace = await dbService.getAnsweredByDateGroupByPlace(curDate);

        let answeredGroupByPlaceString = '';
        answeredGroupByPlace.forEach(region => {
            answeredGroupByPlaceString += `<b>${region.place}:</b> ${region.people.join()}\n`;
        });

        let skippedUsersString = '';
        for (let skippedTgId of skipped) {
            const skippedUser = (await dbService.getUserByTelegramId(skippedTgId))[0];
            skippedUsersString += `${'⚠️'.repeat(skippedUser.user_skippedPolls)} - ${skippedUser.user_firstname}\n`;
        }

        return '<b>Стартувало опитування! Вам в бот прийшло сповіщення.</b>\n' +
            `✅ Вже взяло участь в опитуванні (${amountAnswered}):\n` +
            `${answeredGroupByPlaceString}` +
            `\n` +
            '<b>Поки не вийшли на зв’язок:</b>\n' +
            '(кількість іконок — кількість пропущених опитувань)\n' +
            `${skippedUsersString}` +
            `\n` +
            `⏰ Учасників групи, які не почали користуватись ботом: <b>${amountInGroup - amountConnected}</b>\n` +
            '(щоб почати, натисніть на кнопку нижче та натисніть Start)';
    }
}