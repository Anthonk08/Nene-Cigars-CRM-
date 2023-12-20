const Vendedor = require('../models/Vendedores');
const bcryptjs = require('bcryptjs');

//  Resolvers
const resolvers = {
    Query: {
        obtenerCurso: () => "Algo"
    },
    Mutation: {
        nuevoVendedor: async (_, { input }) => {
            const { email, password } = input;
            // Usuario no exista
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
        }
    }
}

// export
module.exports = resolvers;