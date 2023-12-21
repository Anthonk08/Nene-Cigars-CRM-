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

    type Token {
        token: String
    }

    type Producto {
        id: ID
        nombre: String
        marca: String
        anno: Int
        existencia: Int
        precio: Float
        categoria: String
        capa: String
        forma: String
        tamano: String
        sabor: String
        aroma: String
        fortaleza: String
        creado: String
    }

    input VendedorInput {
        nombre: String!
        apellido: String!
        cargo: String!
        email: String!
        password: String!
    }

    input AutenticarInput {
        email: String!
        password: String!
    }

    input ProductoInput {
        nombre: String!
        marca: String!
        anno: Int!
        existencia: Int!
        precio: Float!
        categoria: String!
        capa: String!
        forma: String!
        tamano: String!
        sabor: String!
        aroma: String!
        fortaleza: String!
    }

    type Query {
        # Vendedores
        obtenerVendedor(token: String!): Vendedor

        #Productos
        obtenerProductos: [Producto]
        obtenerProducto(id: ID!): Producto
    }

    type Mutation {
        # Vendedores
        nuevoVendedor(input: VendedorInput) : Vendedor
        autenticarVendedor(input: AutenticarInput) : Token

        # Productos
        nuevoProducto(input: ProductoInput) : Producto
        actualizarProducto( id:ID!, input:ProductoInput) : Producto
        eliminarProducto( id: ID! ) : String
    }
`;

// export
module.exports = typeDefs;