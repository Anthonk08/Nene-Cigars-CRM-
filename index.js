const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const conectarDB = require('./config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

// Conectar a la BD
conectarDB();

// server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        const token = req.headers['authorization'] || '';
        if(token) {
            try {
                const vendedor = jwt.verify( token, process.env.SECRETPASSWORD );
                return {
                    vendedor
                }
            } catch (error) {
                console.log(`Hubo un error ${error}`);
            }
        }
    }
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