const {Scenes, Markup, session} = require("telegraf");
const dbService = require("../dbService");
const cities = require("../info/cities");

module.exports = new Scenes.WizardScene(
    'checkStateWizard',
    async (ctx) => {
        await ctx.answerCbQuery();
        await ctx.editMessageReplyMarkup(null);

        await ctx.reply('Виберіть де ви знаходитесь? 📍', {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [Markup.button.callback('Вінницька обл', 'vinnitsaReg'), Markup.button.callback('Волинська обл', 'volynReg'), Markup.button.callback('Дніпропетровська обл', 'dniproReg')],
                [Markup.button.callback('Донецька обл', 'donetskReg'), Markup.button.callback('Житомирська обл', 'jitomirReg'), Markup.button.callback('Закарпатська обл', 'zakarpatskaReg')],
                [Markup.button.callback('Запорізька обл', 'zaporijaReg'), Markup.button.callback('Івано-Франківська обл', 'ivanofrankReg'), Markup.button.callback( 'Київська обл', 'kyivReg')],
                [Markup.button.callback('Кіровоградська обл', 'kirovogradReg'), Markup.button.callback('Луганська обл', 'luganskReg'), Markup.button.callback( 'Львівська обл', 'lvivReg')],
                [Markup.button.callback('Миколаївська обл', 'mykolaivReg'), Markup.button.callback('Одеська обл', 'odessaReg'), Markup.button.callback( 'Полтавська обл', 'poltavaReg')],
                [Markup.button.callback('Рівненська обл', 'rivneReg'), Markup.button.callback('Сумська обл', 'sumiReg'), Markup.button.callback( 'Тернопільська обл', 'ternopilReg')],
                [Markup.button.callback('Харківська обл', 'kharkivReg'), Markup.button.callback('Херсонська обл', 'khersonReg'), Markup.button.callback( 'Хмельницька обл', 'hmelnytskReg')],
                [Markup.button.callback('Черкаська обл', 'cherkassyReg'), Markup.button.callback('Чернівецька обл', 'chernivtsiReg'), Markup.button.callback( 'Чернігівська обл', 'chernihivReg')],
                [Markup.button.callback('За кордоном', 'abroad')]
            ]).oneTime()
        });

        return ctx.wizard.next();
    },
    async (ctx) => {
        await ctx.answerCbQuery()
        await ctx.editMessageReplyMarkup(null);
        const callbackAnswer = ctx.update.callback_query.data;

        ctx.session.region = '';
        ctx.session.city = '';

        switch (callbackAnswer)
        {
            case 'abroad':
                ctx.session.region = 'За кордоном';
                return ctx.wizard.steps[2](ctx);
                break;

            case 'vinnitsaReg':
                ctx.session.region = 'Вінницька обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Вінниця', 'vinnytsa'), Markup.button.callback('м. Жмеринка', 'jmerinka'), Markup.button.callback('м. Козятин', 'kozyatin')],
                        [Markup.button.callback('м. Ладижин', 'ladijn'), Markup.button.callback('м. Хмільник', 'hmilnik'), Markup.button.callback('м. Могилів-Подільський', 'mogilev-podilskiy')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'volynReg':
                ctx.session.region = 'Волинська обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Луцьк', 'lutsk'), Markup.button.callback('м. Ковель', 'kovel')],
                        [Markup.button.callback('м. Володимир-Волинський', 'volodymyr-volynskyi'), Markup.button.callback('м. Нововолинськ', 'novovolynsk')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'dniproReg':
                ctx.session.region = 'Дніпропетровська обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Дніпро', 'dnipro'), Markup.button.callback('м. Вільногірськ', 'vilnogirsk'), Markup.button.callback('м. Кам`янське', 'kamyanske')],
                        [Markup.button.callback('м. Жовті Води', 'jovti-vodi'), Markup.button.callback('м. Кривий Ріг', 'krivii-rig'), Markup.button.callback('м. Марганець', 'marganec')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'donetskReg':
                ctx.session.region = 'Донецька обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Донецьк', 'donetsk'), Markup.button.callback('м. Авдіївка', 'avdiivka'), Markup.button.callback('м. Бахмут', 'bahmut')],
                        [Markup.button.callback('м. Горлівка', 'gorlivka'), Markup.button.callback('м. Дебальцеве', 'debalceve'), Markup.button.callback('м. Торецьк', 'toreck')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'jitomirReg':
                ctx.session.region = 'Житомирська обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Житомир', 'jitomir'), Markup.button.callback('м. Бердичів', 'berdichiv'), Markup.button.callback('м. Коростень', 'korosten')],
                        [Markup.button.callback('м. Малин', 'malin'), Markup.button.callback('м. Новоград-Волинський', 'novograd-volynskyi')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'zakarpatskaReg':
                ctx.session.region = 'Закарпатська обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Ужгород', 'ujgorod'), Markup.button.callback('м. Берегове', 'beregove'), Markup.button.callback('м. Мукачево', 'mukachevo')],
                        [Markup.button.callback('м. Хуст', 'hust'), Markup.button.callback('м. Чоп', 'chop')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'zaporijaReg':
                ctx.session.region = 'Запорізька обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Запоріжжя', 'zaporija'), Markup.button.callback('м. Бердянськ', 'berdiansk'), Markup.button.callback('м. Мелітополь', 'melitopol')],
                        [Markup.button.callback('м. Токмак', 'tokmak'), Markup.button.callback('\tм. Енергодар', 'energodar')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'ivanofrankReg':
                ctx.session.region = 'Івано-Франківська обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Івано-Франківськ', 'ivano-frankivsk'), Markup.button.callback('м. Болехів', 'bolehiv'), Markup.button.callback('м. Бурштин', 'burshtin')],
                        [Markup.button.callback('м. Калуш', 'kalush'), Markup.button.callback('м. Коломия', 'kolomya'), Markup.button.callback('м. Яремче', 'yaremche')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'kyivReg':
                ctx.session.region = 'Київська обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Київ', 'kyiv'), Markup.button.callback('м. Біла Церква', 'bila-cerkva'), Markup.button.callback('м. Березань', 'berezan')],
                        [Markup.button.callback('м. Бориспіль', 'boryspil'), Markup.button.callback('м. Бровари', 'brovari'), Markup.button.callback('м. Васильків', 'vasilkyv')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'kirovogradReg':
                ctx.session.region = 'Кіровоградська обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Кропивницький', 'kropyvnitskiy'), Markup.button.callback('м. Олександрія', 'oleksandria')],
                        [Markup.button.callback('м. Світловодськ', 'svitlovodsk'), Markup.button.callback('м. Знам`янка', 'znamyanka')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'luganskReg':
                ctx.session.region = 'Луганська обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Луганськ', 'lugansk'), Markup.button.callback('м. Антрацит', 'antracit'), Markup.button.callback('м. Брянка', 'bryanka')],
                        [Markup.button.callback('м. Голубівка', 'golubivka'), Markup.button.callback('м. Алчевськ', 'alchevsk'), Markup.button.callback('м. Сорокине', 'sorokine')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'lvivReg':
                ctx.session.region = 'Львівська обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Львів', 'lviv'), Markup.button.callback('м. Борислав', 'boryslav'), Markup.button.callback('м. Дрогобич', 'drogobich')],
                        [Markup.button.callback('м. Моршин', 'morshin'), Markup.button.callback('м. Новий Розділ', 'novyi-rozdil'), Markup.button.callback('м. Самбір', 'sambir')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'mykolaivReg':
                ctx.session.region = 'Миколаївська обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Миколаїв', 'mykolaiv'), Markup.button.callback('м. Вознесенськ', 'voznesensk'), Markup.button.callback('м. Очаків', 'ochakiv')],
                        [Markup.button.callback('м. Первомайськ', 'pervomaisk'), Markup.button.callback('м. Южноукраїнськ', 'ujnoukrainsk')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'odessaReg':
                ctx.session.region = 'Одеська обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Одеса', 'odessa'), Markup.button.callback('м. Балта', 'balta'), Markup.button.callback('м. Біляївка', 'bilyaivka')],
                        [Markup.button.callback('м. Білгород-Дністровський', 'bolgorod-dnistrovskiy'), Markup.button.callback('м. Ізмаїл', 'izmail'), Markup.button.callback('м. Чорноморськ', 'chornomorsk')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'poltavaReg':
                ctx.session.region = 'Полтавська обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Полтава', 'poltava'), Markup.button.callback('м. Горішні Плавні', 'gorisni-plavni'), Markup.button.callback('м. Гадяч', 'gadych')],
                        [Markup.button.callback('м. Кременчук', 'kremenchyk'), Markup.button.callback('м. Лубни', 'lybni'), Markup.button.callback('м. Миргород', 'mirgorod')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'rivneReg':
                ctx.session.region = 'Рівненська обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Рівне', 'rivne'), Markup.button.callback('м. Дубно', 'dybno')],
                        [Markup.button.callback('м. Вараш', 'varash'), Markup.button.callback('м. Острог', 'ostrog')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'sumiReg':
                ctx.session.region = 'Сумська обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Суми', 'sumi'), Markup.button.callback('м. Охтирка', 'oxtirka'), Markup.button.callback('м. Глухів', 'gluxiv')],
                        [Markup.button.callback('м. Конотоп', 'konotop'), Markup.button.callback('м. Лебедин', 'lebedin'), Markup.button.callback('м. Ромни', 'romni')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'ternopilReg':
                ctx.session.region = 'Тернопільська обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Тернопіль', 'ternopil'), Markup.button.callback('м. Чортків', 'chortkiv')],
                        [Markup.button.callback('м. Бережани', 'berezani'), Markup.button.callback('м. Кременець', 'kremenets')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'kharkivReg':
                ctx.session.region = 'Харківська обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Харків', 'kharkiv'), Markup.button.callback('м. Ізюм', 'izum'), Markup.button.callback('м. Куп`янськ', 'kypyantsk')],
                        [Markup.button.callback('м. Лозова', 'lozova'), Markup.button.callback('м. Люботин', 'lubotin'), Markup.button.callback('м. Первомайський', 'pervomaiskiy')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'khersonReg':
                ctx.session.region = 'Херсонська обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Херсон', 'kherson'), Markup.button.callback('м. Гола Пристань', 'gola-pristan')],
                        [Markup.button.callback('м. Каховка', 'kaxovka'), Markup.button.callback('м. Нова Каховка', 'nova-kaxovka')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'hmelnytskReg':
                ctx.session.region = 'Хмельницька обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Хмельницький', 'khmelnitsk'), Markup.button.callback('м. Нетішин', 'nitishin'), Markup.button.callback('м. Славута', 'slavuta')],
                        [Markup.button.callback('м. Кам`янець-Подільський', 'kamyanets-podolski'), Markup.button.callback('м. Шепетівка', 'shepitivka'), Markup.button.callback('м. Старокостянтинів', 'starokostantiniv')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'cherkassyReg':
                ctx.session.region = 'Черкаська обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Черкаси', 'cherkasu'), Markup.button.callback('м. Ватутіне', 'vatutine'), Markup.button.callback('м. Канів', 'kaniv')],
                        [Markup.button.callback('м. Золотоноша', 'zolotonosha'), Markup.button.callback('м. Сміла', 'smila'), Markup.button.callback('м. Умань', 'uman')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'chernivtsiReg':
                ctx.session.region = 'Чернівецька обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Чернівці', 'chernivtsi'), Markup.button.callback('м. Новодністровськ', 'novodnisrovsk')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            case 'chernihivReg':
                ctx.session.region = 'Чернігівська обл';
                await ctx.reply('Оберіть місто 📍', {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback('м. Чернігів', 'chernihiv'), Markup.button.callback('м. Ніжин', 'nizin')],
                        [Markup.button.callback('м. Новгород-Сіверський', 'novgorod-siversky'), Markup.button.callback('м. Прилуки', 'prylyki')],
                        [Markup.button.callback('Інше', 'other')]
                    ])
                });
                break;

            default:
                break;
        }

        return ctx.wizard.next();
    },
    async (ctx) => {
        const cities = require('../info/cities');
        await ctx.answerCbQuery();

        if(ctx.session.region !== 'За кордоном') {
            const chosenCity = ctx.update.callback_query.data;
            ctx.session.city = cities[chosenCity];

            await ctx.editMessageReplyMarkup(null);
        }
        const userPlace = `${ctx.session.region === 'За кордоном' ? `${ctx.session.region}` : `${ctx.session.region}|${ctx.session.city}`}`;
        const userTgId = ctx.update.callback_query.from.id;
        const curDate = new Date();

        await ctx.reply(
            `✅ <b><u>Надана інформація:</u></b>\n🕒 ${curDate.getUTCDate()}/${curDate.getUTCMonth() + 1}/${curDate.getUTCFullYear()} ${curDate.getUTCHours()}:${curDate.getUTCMinutes()} (UTC)\n🗺️ <b><u>Місце:</u></b> ${ctx.session.region}\n${ctx.session.city ? `📍 <b><u>Місто:</u></b> ${ctx.session.city}` : ''}`, {
                parse_mode: 'HTML',
            });

        await dbService.insertUserCheck(userTgId, userPlace);
        await dbService.setSkippedPoll(userTgId, 0);

        const pollSender = require('../sendPoll');
        const groupId = (await dbService.getUserByTelegramId(userTgId))[0].user_groups[0];
        await pollSender.editGroupPoll(ctx, groupId);

        return ctx.scene.leave();
    }
)