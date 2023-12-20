const { gql } = require('apollo-server');

// Schema
const typeDefs = gql`
    type Query {
        obtenerCurso: String
    }
`;

// export
module.exports = typeDefs;