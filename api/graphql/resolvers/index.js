const postsResolvers = require("./posts");
const usersResolvers = require("./users");
const friendsResolvers = require("./friends");

module.exports = {
    Query: {
        ...postsResolvers.Query,
        ...usersResolvers.Query,
        ...friendsResolvers.Query,
    },
    Mutation: {
        ...postsResolvers.Mutation,
        ...usersResolvers.Mutation,
        ...friendsResolvers.Mutation,
    },
};
