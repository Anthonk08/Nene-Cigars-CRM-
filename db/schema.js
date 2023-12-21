const { gql } = require('apollo-server');

// Schema
const typeDefs = gql`

    type Vendedor {
        id: ID
        nombre: String
        apellido: String
        cargo: String
        email: String
        creado: String
    }

    input VendedorInput {
        nombre: String!
        apellido: String!
        cargo: String!
        email: String!
        password: String!
    }

    type Token {
        token: String
    }

    input AutenticarInput {
        email: String!
        password: String!
    }

    type Query {
        obtenerVendedor(token: String!): Vendedor
    }

    type Mutation {
        nuevoVendedor(input: VendedorInput) : Vendedor
        autenticarVendedor(input: AutenticarInput) : Token
    }
`;

// export
module.exports = typeDefs;