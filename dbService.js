const mongodb = require('mongodb')

class dbService {

    static async getUsers() {
        const client = await mongodb.MongoClient.connect(
            'mongodb+srv://bloowbound:DD46ZVSKHxoaA1p8@cluster0.zorqs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
            {
                useNewUrlParser: true
            });

        return client.db('Cluster0').collection('users').find({}).toArray();
    }

    static async getUsersDev() {
        const client = await mongodb.MongoClient.connect(
            'mongodb+srv://bloowbound:DD46ZVSKHxoaA1p8@cluster0.zorqs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
            {
                useNewUrlParser: true
            });

        return client.db('Cluster0').collection('users');
    }

    static async getUserByTelegramId(telegramId) {
        try {
            return (await this.getUsersDev()).find({user_tgid: telegramId}).toArray();
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async getUsersWithGroup(groupId) {
        try {
            return (await this.getUsersDev()).find({user_groups: groupId}).toArray();
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async insertUser(tgId, firstname) {
        try {
            if ((await (await this.getUsersDev()).find({user_tgid: tgId}).toArray()).length > 0) {
                return false;
            }

            (await this.getUsersDev()).insertOne({
                user_tgid: tgId,
                user_firstname: firstname,
                user_skippedPolls: 0,
                user_groups: []
            });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async addSkippedPoll(tgId) {
        try {
            let skippedPolls = (await this.getUserByTelegramId(tgId))[0].user_skippedPolls;
            skippedPolls++;
            (await this.getUsersDev()).updateOne({user_tgid: tgId}, {$set: {user_skippedPolls: skippedPolls}});
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async setSkippedPoll(tgId, skippedPolls) {
        try {
            // const skippedPolls = (await this.getUserByTelegramId(tgId)).user_skippedPolls;
            (await this.getUsersDev()).updateOne({user_tgid: tgId}, {$set: {user_skippedPolls: skippedPolls }});
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async insertGroupToUser(userTgId, groupTgId) {
        try {
            if(await (await ((await this.getUsersDev()).find({user_tgid: userTgId}).toArray()).length) >= 1)
            {
                return false;
            }

            (await this.getUsersDev()).updateOne({user_tgid: userTgId}, {$push: {user_groups: groupTgId}});
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async deleteGroupFromUser(userTgId, groupTgId) {
        try {
            if(await (await ((await this.getUsersDev()).find({user_tgid: userTgId}).toArray()).length) < 1)
            {
                return false;
            }

            (await this.getUsersDev()).updateOne({user_tgid: userTgId}, {$pull: {user_groups: groupTgId}});
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async deleteUser(tgId) {
        try {
            (await this.getUsersDev()).deleteOne({user_tgid: tgId});
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async getNotContactedUsers(groupRegisteredUsers, answeredToday, isFirstForDay) {
        let notContactedUsers = [];

        for(let user of groupRegisteredUsers)
        {
            let res = false;

            answeredToday.forEach(userCheck => {
                if(user.user_tgid === userCheck.usercheck_user_tg_id)
                {
                    res = true;
                }
            });

            if(!res)
            {
                if(isFirstForDay) {
                    (await dbService.addSkippedPoll(user.user_tgid))
                }
                notContactedUsers.push(user.user_tgid);
            }
        }

        return notContactedUsers;
    }

    static async getGroups() {
        const client = await mongodb.MongoClient.connect(
            'mongodb+srv://bloowbound:DD46ZVSKHxoaA1p8@cluster0.zorqs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
            {
                useNewUrlParser: true
            });

        return client.db('Cluster0').collection('groups').find({}).toArray();
    }

    static async getGroupsDev() {
        const client = await mongodb.MongoClient.connect(
            'mongodb+srv://bloowbound:DD46ZVSKHxoaA1p8@cluster0.zorqs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
            {
                useNewUrlParser: true
            });

        return client.db('Cluster0').collection('groups');
    }

    static async getGroupByTelegramId(tgId) {
        try {
            return (await this.getGroupsDev()).find({group_tgid: tgId}).toArray();
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async insertGroup(tgId, name) {
        try {

            if ((await (await this.getGroupsDev()).find({group_tgid: tgId}).toArray()).length > 0) {
                return false;
            }

            (await this.getGroupsDev()).insertOne({
                group_tgid: tgId,
                group_name: name,
                group_startDate: `${new Date().getUTCFullYear()}/${new Date().getUTCMonth() + 1}/${new Date().getUTCDate()}`,
                group_pollsMsgIds: []
            });
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async deleteGroup(tgId) {
        try {
            (await this.getGroupsDev()).deleteOne({group_tgid: tgId});
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async addPollToGroup(msgId, groupId){
        try {

            if((await (await this.getGroupsDev()).find({group_tgid: groupId, group_pollsMsgIds: msgId}).toArray()).length > 1)
            {
                return false;
            }

            (await this.getGroupsDev()).updateOne({group_tgid: groupId}, {$push: {group_pollsMsgIds: msgId}});

        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async getUserChecks() {
        const client = await mongodb.MongoClient.connect(
            'mongodb+srv://bloowbound:DD46ZVSKHxoaA1p8@cluster0.zorqs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
            {
                useNewUrlParser: true
            });

        return client.db('Cluster0').collection('userchecks').find({}).toArray();
    }

    static async getUserChecksDev() {
        const client = await mongodb.MongoClient.connect(
            'mongodb+srv://bloowbound:DD46ZVSKHxoaA1p8@cluster0.zorqs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
            {
                useNewUrlParser: true
            });

        return client.db('Cluster0').collection('userchecks');
    }

    static async getUserChecksByDate(date) {
        try {
            return (await this.getUserChecksDev()).find({usercheck_date: date}).toArray();
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async getAnsweredByDateGroupByPlace(date) {
        try {
            const checkedPlaces = [...new Set((await (await this.getUserChecksDev())
                .distinct('usercheck_place'))
                .map(place => place.split('|')[0] ? place.split('|')[0] : place))]; // ["kharkiv", "kyiv"]

            let placePeopleArray = [];

            for (let place of checkedPlaces)
            {
                const tgIdsInPlaceToday = (await (await this.getUserChecksDev())
                    .find({ usercheck_date: date, usercheck_place: {$regex: place } })
                    .project({_id: 0, usercheck_user_tg_id: 1})
                    .toArray()).map(person => person.usercheck_user_tg_id);

                if(tgIdsInPlaceToday.length > 0)
                {
                    let peopleNames = [];
                    for (const person of tgIdsInPlaceToday) {
                        const personCity = (await (await dbService.getUserChecksDev())
                            .find({usercheck_date: date, usercheck_user_tg_id: person})
                            .project({_id: 0, usercheck_place: 1})
                            .toArray())[0];
                        peopleNames.push(`${(await dbService.getUserByTelegramId(person))[0].user_firstname} ${personCity.usercheck_place.split('|')[1] ? `(${personCity.usercheck_place.split('|')[1]})` : ''}`);
                    }

                    placePeopleArray.push({
                        place: place,
                        people: peopleNames
                    });
                }
            }

            return placePeopleArray;

        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async getUserChecksByTelegramId(telegramId) {
        try {
            return (await this.getUserChecksDev()).find({usercheck_user_tg_id: telegramId}).toArray();
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    static async insertUserCheck(userTgId, place) {
        try {

            if ((await (await this.getUserChecksDev()).find({
                usercheck_user_tg_id: userTgId,
                usercheck_date: `${new Date().getUTCFullYear()}/${new Date().getUTCMonth() + 1}/${new Date().getUTCDate()}`
            }).toArray()).length > 0) {
                return false;
            }

            (await this.getUserChecksDev()).insertOne({
                usercheck_user_tg_id: userTgId,
                usercheck_place: place,
                usercheck_date: `${new Date().getUTCFullYear()}/${new Date().getUTCMonth() + 1}/${new Date().getUTCDate()}`
            });
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}

module.exports = dbService;