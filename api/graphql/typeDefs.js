const gql = require("graphql-tag");

module.exports = gql`
    type Post {
        id: ID!
        username: String!
        createdAt: String!
        body: String!
    }
    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type User {
        id: ID!
        username: String!
        token: String!
        createdAt: String!
    }
    type Query {
        getPosts: [Post]
    }
    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
    }
`;
