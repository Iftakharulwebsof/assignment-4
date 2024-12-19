const express = require('express')
const cookieParser  = require('cookie-parser')
const cors = require('cors')
const app = express()
const port = 3000
const dotenv = require("dotenv");
const dBConnection = require('./DB/db');
dotenv.config();

// app config

app.use(express.json())
app.use(cors())
app.use(cookieParser())


//DB CONNECTION
 dBConnection()




//ROUTERS IMPORT
const userRouters = require('./routers/userRoutes')

// API SETUP ROUTERS

app.use('/api/users',userRouters)


app.get('/', (req, res) => {
  res.send('Server Running!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})