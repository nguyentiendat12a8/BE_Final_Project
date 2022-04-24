const mongoose = require('mongoose')


exports.connectDB = async () =>{
    try {
        await mongoose.connect(process.env.DB, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
            autoIndex:true
        })
        console.log("Connect to database successfully!")
    } catch (error) {
        console.log("Connect to database failed!")
    }
}
