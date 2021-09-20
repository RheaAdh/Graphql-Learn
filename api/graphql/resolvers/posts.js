const Post = require("../../models/Post");
const User = require("../../models/User");
const checkAuth = require("../../util/check-auth");
const { AuthenticationError } = require("apollo-server");
module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getPost(parent, { postId }) {
            try {
                let post = await Post.findOne({ _id: postId });
                if (post) {
                    return post;
                } else {
                    throw new Error("Post not found");
                }
            } catch (err) {
                throw new Error(err);
            }
        },
    },
    Mutation: {
        async createPost(parent, { body }, context) {
            try {
                const user = checkAuth(context);
                const newPost = new Post({
                    body,
                    user: user.id,
                    username: user.username,
                    createdAt: new Date().toISOString(),
                });
                return await newPost.save();
            } catch (err) {
                throw new Error(err);
            }
        },
        async deletePost(parent, { postId }, context) {
            const user = checkAuth(context);
            try {
                const post = await Post.findById(postId);
                if (user.username == post.username) {
                    await post.delete();
                } else {
                    throw new AuthenticationError(
                        "You cannot delete this post"
                    );
                }
                return "Post deleted.";
            } catch (err) {
                throw new Error(err);
            }
        },
    },
};
