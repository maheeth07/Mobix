const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

function connectDB() {
    mongoose
        .connect(process.env.MONGO_DB)
        .then(() => console.log('Connected to DB'))
        .catch(err => console.log(err));
}

module.exports=connectDB;