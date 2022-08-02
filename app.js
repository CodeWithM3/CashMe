const express = require('express')
const connectDb = require('./database/connection')
const apiRoutes = require('./apiRoutes/routes')
const bodyParser = require('body-parser')
const {serverAdapter} = require('./queues/sendingMoneyqueue')

require('dotenv').config()
const app = express()
connectDb()


const PORT = process.env.PORT

serverAdapter.setBasePath('/admin/queues')
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));
app.use('/api', apiRoutes)
app.use('/admin/queues', serverAdapter.getRouter())
app.listen(PORT,()=>console.log(`Server is up running on ${PORT}`))