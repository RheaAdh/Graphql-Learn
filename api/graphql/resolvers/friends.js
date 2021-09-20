const Post = require("../../models/Post");
const User = require("../../models/User");
const checkAuth = require("../../util/check-auth");
const { AuthenticationError } = require("apollo-server");

module.exports = {
    Query: {
        async getFriends(parent, _, context) {
            const user = checkAuth(context);
            try {
                return user.friends;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getFriendRequests() {
            const user = checkAuth(context);
            try {
                return user.friendRequests;
            } catch (err) {
                throw new Error(err);
            }
        },
    },
    Mutation: {
        async addFriend(parent, { username }, context) {
            const user = checkAuth(context);//jwt
            try {
                const friend = await User.findOne({ username: username });
                if (!friend) {
                    console.log("oops");
                    throw new Error("Friend doesnt exist");
                }
                for (let i = 0; i < friend.friendRequests.length; i++) {
                    if (friend.friendRequests[i].username == user.username) {
                        console.log("already req");
                        throw new Error("Already requested");
                    }
                }

                friend.friendRequests.push({ username: user.username });
                console.log(friend);
                return friend.save();
            } catch (err) {
                throw new Error(err);
            }
        },
        async removeFriend(parent, { username }, context) {
            const user = checkAuth(context);
            try {
                const me = await User.findOne({ username: user.username });
                const friend = await User.findOne({ username: username });
                if (!friend) {
                    console.log("oops");
                    throw new Error("Friend doesnt exist");
                }
                let idx = me.friends.findIndex((x) => x.username === username);
                me.friends.splice(idx, 1);
                console.log(me);
                return me.save();
            } catch (err) {
                throw new Error(err);
            }
        },
        async acceptFriendRequest(parent, { username }, context) {
            const user = checkAuth(context);
            try {
                const me = await User.findOne({ username: user.username });
                console.log(me);
                const friend = await User.findOne({ username: username });
                if (!friend) {
                    console.log("oops");
                    throw new Error("Friend doesnt exist");
                }
                let idx = me.friendRequests.findIndex(
                    (x) => x.username === username
                );
                me.friendRequests.splice(idx, 1);
                me.friends.push({ username: username });
                return me.save();
            } catch (err) {
                throw new Error(err);
            }
        },
        async rejectFriendRequest(parent, { username }, context) {
            const user = checkAuth(context);
            try {
                const me = await User.findOne({ username: user.username });
                console.log(me);
                const friend = await User.findOne({ username: username });
                if (!friend) {
                    console.log("oops");
                    throw new Error("Friend doesnt exist");
                }
                let idx = me.friendRequests.findIndex(
                    (x) => x.username === username
                );
                me.friendRequests.splice(idx, 1);
                return me.save();
            } catch (err) {
                throw new Error(err);
            }
        },
    },
};
