const gql = require("graphql-tag");

module.exports = gql`
    type Post {
        id: ID!
        username: String!
        createdAt: String!
        body: String!
    }
    type Query {
        getPosts: [Post]
    }
`;
