const Vendedor = require('../models/Vendedores');
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
        }
    },
    Mutation: {
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

            const { email, password} = input;
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

        }
    }
}

// export
module.exports = resolvers;