const Post = require("../../models/Post");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const {
    validateRegisterInput,
    validateLoginInput,
} = require("../../util/validators");

function generateToken(user) {
    console.log(process.env.JWT_SECRET);
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
}

module.exports = {
    Query: {},
    Mutation: {
        async register(
            parent,
            { registerInput: { username, password, email, confirmPassword } }
        ) {
            const { valid, errors } = validateRegisterInput(
                username,
                email,
                password,
                confirmPassword
            );
            if (!valid) {
                throw new UserInputError("Errors", {
                    errors,
                });
            }
            const user = await User.findOne({ username: username });
            if (user) {
                throw new UserInputError("Username is taken", {
                    errors: {
                        username: "Username taken",
                    },
                });
            }
            password = await bcrypt.hash(password, 10);
            const newUser = new User({
                email,
                password,
                username,
                createdAt: new Date().toISOString(),
            });
            const res = await newUser.save();
            console.log(res);
            const token = await generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token,
            };
        },
        async login(parent, { username, password }) {
            const { valid, errors } = validateLoginInput(username, password);
            if (!valid) {
                throw new UserInputError("Errors", {
                    errors,
                });
            }
            const user = await User.findOne({ username: username });
            if (!user) {
                throw new UserInputError("Username doesnt exist", {
                    errors: {
                        general: "Username doesnt exist",
                    },
                });
            }
            console.log(user);
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new UserInputError("Wrong credentials", {
                    errors: {
                        general: "Wrong credentials",
                    },
                });
            }
            const token = generateToken(user);
            console.log(token);
            console.log("logged in!");
            return {
                ...user._doc,
                id: user._id,
                token,
            };
        },
    },
};
