const Vendedor = require('../models/Vendedores');
const Producto = require('../models/Producto');
const Cliente = require('../models/Clientes');
const Pedido = require('../models/Pedido');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

// Funciones
const crearToken = ( vendedor, secretPassword, expiresIn ) => {
    //console.log(vendedor);
    const {id, email, nombre, apellido} =  vendedor;

    return jwt.sign({ id, email, nombre, apellido }, secretPassword, {expiresIn})
};


//  Resolvers
const resolvers = {
    Query: {
        obtenerVendedor: async (_, { token }) => {
            const vendedorId = await jwt.verify(token, process.env.SECRETPASSWORD)
            return vendedorId
        },
        obtenerProductos: async () => {
            try {
                const productos = await Producto.find({});
                return productos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerProducto: async (_, { id }) => {
            // Reviso si el producto existe
            const producto = await Producto.findById(id);
            if(!producto) {
                throw new Error('Producto no encontrado');
            }

            return producto;
        },
        obtenerClientes: async () => {
            try {
                const clientes = await Cliente.find({});
                return clientes;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerClientesVendedor: async ( _, {}, ctx ) => {
            try {
                const clientes = await Cliente.find({ vendedor: ctx.vendedor.id.toString() });
                return clientes;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerCliente: async (_, { id }, ctx) => {
            // Revisar si el cliente existe o no
            const cliente = await Cliente.findById(id);

            if(!cliente) {
                throw new Error('Cliente no existe...');
            }

            // Quien lo creo lo puede ver
            if(cliente.vendedor.toString() !== ctx.vendedor.id) {
                throw new Error('No tienes las credenciales...');
            }

            return cliente;
        },
        obtenerPedidos: async () => {
            try {
                const pedidos = await Pedido.find({});
                return pedidos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerPedidosVendedor: async ( _, {}, ctx ) => {
            try {
                const pedidos = await Pedido.find({ vendedor: ctx.vendedor.id });
                return pedidos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerPedido: async (_, { id }, ctx) => {
            // Revisar si el pedido existe o no
            const pedido = await Pedido.findById(id);

            if(!pedido) {
                throw new Error('Pedido no existe...');
            }

            // Quien lo creo lo puede ver
            if(pedido.vendedor.toString() !== ctx.vendedor.id) {
                throw new Error('No tienes las credenciales...');
            }

            return pedido;
        },
        obtenerPedidosEstado: async (_, { estado }, ctx) => {
            const pedidos = await Pedido.find({ vendedor: ctx.vendedor.id, estado });
            return pedidos;
        },
        mejoresClientes: async () => {
            const clientes = await Pedido.aggregate([
                { $match: { estado : "COMPLETADO"}},
                { $group: {
                    _id : "$cliente",
                    total: { $sum: '$total' }
                }},
                {
                    $lookup: {
                        from: 'clientes',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'cliente'
                    }
                },
                {
                    $limit: 10
                },
                {
                    $sort: {total: -1}
                },
            ]);

            return clientes;
        },
        mejoresVendedores: async () => {
            const vendedores = await Pedido.aggregate([
                { $match: { estado: "COMPLETADO"}},
                { $group: {
                    _id: "$vendedor",
                    total: { $sum: "$total"}
                }},
                {
                    $lookup: {
                        from: 'vendedores',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'vendedor'
                    }
                },
                {
                    $limit: 3
                },
                {
                    $sort: {total: -1}
                }
            ]);

            return vendedores;
        },
        buscarProducto: async (_, { texto }) => {
            const productos = await Producto.find({ $text: { $search: texto }}).limit(10);

            return productos;
        },
    },
    Mutation: {
        // Vendedor
        nuevoVendedor: async (_, { input }) => {
            const { email, password } = input;
            // Vendedor no exista
            const existeVendedor = await Vendedor.findOne({email});
            if (existeVendedor) {
                throw new Error('Usuario registrado')
            }

            // Hashear el password
            const salt = await bcryptjs.genSaltSync(10);
            input.password = await bcryptjs.hashSync(password, salt);

            // Guardar en la BD
            try {
                // Guardar en BD
                const vendedor = new Vendedor(input);
                vendedor.save(); // Guardar
                return vendedor;
            } catch (error) {
                console.log(error);
            }
        },
        autenticarVendedor: async (_, {input}) => {

            const { email, password } = input;
            // El Vendedor existe
            const existeVendedor = await Vendedor.findOne({email});
            if (!existeVendedor) {
                throw new Error('Vendedor no existe...');
            }

            // Revisar password
            const passwordCorrecto = await bcryptjs.compareSync(password, existeVendedor.password);
            if(!passwordCorrecto) {
                throw new Error('La contraseña es incorrecta...');
            }

            // Crear el token
            return {
                token: crearToken( existeVendedor, process.env.SECRETPASSWORD, '24h' )
            }
        },
        //Productos
        nuevoProducto: async (_, {input}) => {
            try {
                const producto = new Producto(input);

                // Almacenar en la BD
                const resultado = await producto.save();

                return resultado;
            } catch(error) {
                console.log(error);
            }
        },
        actualizarProducto: async (_, {id, input}) => {
            // Reviso si el producto existe
            let producto = await Producto.findById(id);
            if(!producto) {
                throw new Error('Producto no existe...');
            }

            // Guardar en la BD
            producto = await Producto.findOneAndUpdate({ _id : id }, input, { new: true });
            return producto;
        },
        eliminarProducto: async (_, {id}) => {
            // Reviso si el producto existe
            let producto = await Producto.findById(id);
            if(!producto) {
                throw new Error('Producto no existe...');
            }

            // Eliminar
            await Producto.findOneAndDelete({ _id: id });
            return "Producto Eliminado";
        },
        //Clientes
        nuevoCliente: async (_, {input}, ctx) => {
            const { email } = input;

            // Verificar si el cliente esta registrado
            const cliente = await Cliente.findOne({ email });
            if(cliente) {
                throw new Error('Cliente registrado');
            }

            const nuevoCliente = new Cliente(input);

            // Asignar el vendedor
            nuevoCliente.vendedor = ctx.vendedor.id;

            // Guardarlo en la BD
            try {
                const resultado = await nuevoCliente.save();

                return resultado;
            } catch(error) {
                console.log(error);
            }
        },
        actualizarCliente: async (_, {id, input}, ctx) => {
            // Existe cliente
            let cliente = await Cliente.findById(id);

            if(!cliente) {
                throw new Error('Ese cliente no existe...');
            }

            // Verificar si el vendedor es quien edita
            if(cliente.vendedor.toString() !== ctx.vendedor.id) {
                throw new Error('No tienes las credenciales...');
            }

            // Guardar cliente
            cliente = await Cliente.findOneAndUpdate({_id: id}, input, {new: true});
            return cliente;
        },
        eliminarCliente: async (_, {id}, ctx) => {
            // Existe cliente
            let cliente = await Cliente.findById(id);

            if(!cliente) {
                throw new Error('Ese cliente no existe...');
            }

            // Verificar si el vendedor es quien edita
            if(cliente.vendedor.toString() !== ctx.vendedor.id) {
                throw new Error('No tienes las credenciales...');
            }

            // Borrar cliente
            await Cliente.findOneAndDelete({_id: id});
            return "Cliente Eliminado";
        },
        // Pedido
        nuevoPedido: async (_, {input}, ctx) => {
            const {cliente} = input

            // Cliente existe
            let clienteExiste = await Cliente.findById(cliente);

            if(!clienteExiste) {
                throw new Error('Ese cliente no existe...');
            }
            // Verificar si el cliente es del vendedor
            if(clienteExiste.vendedor.toString() !== ctx.vendedor.id) {
                throw new Error('No tienes las credenciales...');
            }

            // Revisar que el stock este disponible
            for await ( const articulo of input.pedido ) {
                const {id} = articulo;

                const producto = await Producto.findById(id);

                if(articulo.cantidad > producto.existencia) {
                    throw new Error(`El articulo: ${producto.nombre} excede la cantidad disponible`);
                }else {
                    //Restar la cantidad al Stock
                    producto.existencia = producto.existencia - articulo.cantidad;

                    await producto.save();
                }
            }
            // Crear un nuevo pedido
            const nuevoPedido = new Pedido(input);

            // Asignar vendedor
            nuevoPedido.vendedor = ctx.vendedor.id;

            // Guardar BD
            const resultado = await nuevoPedido.save();
            return resultado;
        },
        actualizarPedido: async (_, {id, input}, ctx) => {
            const { cliente } = input;

            // Existe el pedido
            const existePedido = await Pedido.findById(id);
            if(!existePedido) {
                throw new Error('Ese pedido no existe...');
            }

            // Existe el cliente
            const existeCliente = await Cliente.findById(cliente);
            if(!existeCliente) {
                throw new Error('El cliente no existe...');
            }

            // Verificar si el cliente existe y el pedido pertenece al vendedor
            if(existeCliente.vendedor.toString() !== ctx.vendedor.id) {
                throw new Error('No tienes las credenciales...');
            }

            // Revisar disponibilidad
            if(input.pedido) {
                for await ( const articulo of input.pedido ) {
                    const {id} = articulo;
    
                    const producto = await Producto.findById(id);
    
                    if(articulo.cantidad > producto.existencia) {
                        throw new Error(`El articulo: ${producto.nombre} excede la cantidad disponible`);
                    }else {
                        //Restar la cantidad al Stock
                        producto.existencia = producto.existencia - articulo.cantidad;
    
                        await producto.save();
                    }
                }
            }

            // Guardar pedido
            const resultado = await Pedido.findOneAndUpdate({_id: id}, input, {new: true});
            return resultado;
        },
        eliminarPedido: async (_, {id}, ctx) => {
            // Verificar sie l pedido existe
            const pedido = await Pedido.findById(id);
            if(!pedido) {
                throw new Error('El pedido no existe');
            }

            // Vendedor lo intenta borrar
            if(pedido.vendedor.toString() !== ctx.vendedor.id) {
                throw new Error('No tienes credenciales');
            }

            // Eliminar
            await Pedido.findOneAndDelete({_id: id})
            return "Pedido eliminado"
        }
    }
}

// export
module.exports = resolvers;