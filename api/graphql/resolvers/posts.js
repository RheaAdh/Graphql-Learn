const Post = require("../../models/Post");
const User = require("../../models/User");

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find();
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },
    },
};
