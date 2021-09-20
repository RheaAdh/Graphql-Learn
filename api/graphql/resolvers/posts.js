const Post = require("../../models/Post");
const User = require("../../models/User");
const checkAuth = require("../../util/check-auth");
const { AuthenticationError } = require("apollo-server");

module.exports = {
    Query: {
        async getPosts(_, __, context) {
            const user = checkAuth(context);
            try {
                const me = await User.findOne({ username: user.username });
                let friends = me.friends;
                const posts = await Post.find().sort({ createdAt: -1 });
                let friendsposts = [];
                for (let i = 0; i < friends.length; i++) {
                    let friendname = friends[i].username;
                    for (let j = 0; j < posts.length; j++) {
                        if (posts[j].username == friendname) {
                            friendsposts.push(posts[j]);
                        }
                    }
                }
                return friendsposts;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getPost(parent, { postId }, context) {
            const user = checkAuth(context);
            try {
                const me = await User.findOne({ username: user.username });
                let post = await Post.findOne({ _id: postId });
                if (post) {
                    let friends = me.friends;
                    for (let i = 0; i < friends.length; i++) {
                        if (friends[i].username == post.username) {
                            return post;
                        }
                    }
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
