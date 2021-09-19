const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = express();

const { ApolloServer } = require("apollo-server");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");

// Load Config
dotenv.config({ path: "./.env" });

// Connect Database
connectDB();

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
});

server.listen({ port: 5000 }).then((res) => {
    console.log("Server running on " + res.url);
});
