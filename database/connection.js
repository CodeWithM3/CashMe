const mongoose = require('mongoose')
require('dotenv').config()

const connectDb = async()=>{
try {
    await mongoose.connect(process.env.URI)
    console.log('Database connected successfully')
} catch (error) {
    console.error('Database connection is unsuccessful')
}
}
module.exports = connectDb