const { gql } = require('apollo-server');

// Schema
const typeDefs = gql`
    type Query {
        obtenerCurso: String
    }

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

    type Mutation {
        nuevoVendedor(input: VendedorInput) : Vendedor
    }
`;

// export
module.exports = typeDefs;