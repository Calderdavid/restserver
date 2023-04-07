
const mongoose = require('mongoose');



const dbConnection = async() => {
    try {
        await mongoose.connect(process.env.MONGO_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Base de datos online');
    
    } catch (e) {
        console.log(e)
        throw new Error('error a la hora de iniciar la base de datos');
    }

}




module.exports = {
    dbConnection
}