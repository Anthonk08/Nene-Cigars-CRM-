const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const conectarDB = require('./config/db');

// Conectar a la BD
conectarDB();

// server
const server = new ApolloServer({
    typeDefs,
    resolvers
});

// Begin thew server
server
    .listen()
    .then(({ url }) => {
        console.log(`Server ready in the URL ${url}`);
})
    .catch((err) => {
        console.log(err);
});