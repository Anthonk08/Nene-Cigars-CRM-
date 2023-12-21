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

    type Cliente {
        id: ID
        nombre: String
        apellido: String
        cedula: String
        direccion: String
        status: String
        email: String
        telefono: String
        vendedor: ID
        creado: String
    }

    type Pedido {
        id: ID
        pedido: [PedidoGrupo]
        total: Float
        cliente: ID
        vendedor: ID
        fecha: String
        estado: EstadoPedido
    }

    type PedidoGrupo {
        id: ID
        cantidad: Int
    }

    type TopCliente {
        total: Float
        cliente: [Cliente]
    }

    type TopVendedor {
        total: Float
        vendedor: [Vendedor]
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

    input ClienteInput{
        nombre: String!
        apellido: String!
        cedula: String!
        direccion: String!
        status: String
        email: String!
        telefono: String
    }

    input PedidoProductoInput{
        id: ID
        cantidad: Int
    }

    input PedidoInput{
        pedido: [PedidoProductoInput]
        total: Float
        cliente: ID
        estado: EstadoPedido
    }

    enum EstadoPedido {
        PENDIENTE
        COMPLETADO
        CANCELADO
    }

    type Query {
        #Vendedores
        obtenerVendedor(token: String!): Vendedor

        #Productos
        obtenerProductos: [Producto]
        obtenerProducto(id: ID!): Producto

        #Clientes
        obtenerClientes: [Cliente]
        obtenerClientesVendedor: [Cliente]
        obtenerCliente(id: ID!): Cliente

        #Pedidos
        obtenerPedidos: [Pedido]
        obtenerPedidosVendedor: [Pedido]
        obtenerPedido(id: ID!): Pedido
        obtenerPedidosEstado(estado: String!): [Pedido]

        # Busquedas avanzadas
        mejoresClientes: [TopCliente]
        mejoresVendedores: [TopVendedor]
        buscarProducto(texto: String!): [Producto]
    }

    type Mutation {
        # Vendedores
        nuevoVendedor(input: VendedorInput) : Vendedor
        autenticarVendedor(input: AutenticarInput) : Token

        # Productos
        nuevoProducto(input: ProductoInput) : Producto
        actualizarProducto( id:ID!, input:ProductoInput) : Producto
        eliminarProducto( id: ID! ) : String

        # Clientes
        nuevoCliente(input: ClienteInput) : Cliente
        actualizarCliente( id:ID!, input:ClienteInput) : Cliente
        eliminarCliente( id: ID! ) : String

        # Pedidos
        nuevoPedido(input: PedidoInput): Pedido
        actualizarPedido(id: ID!, input: PedidoInput) : Pedido
        eliminarPedido( id: ID! ) : String
    }
`;

// export
module.exports = typeDefs;