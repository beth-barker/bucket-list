require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')

const {SERVER_PORT} = process.env

app.use(express.json())
app.use(cors())




//destructure from controller
const{seed, getAllActivities, createCompleted, deleteItem, createItem, getAllItems, updateCompleteValue} = require('./controller')

//set endpoints
app.post('/seed', seed)

app.get('/completed', getAllActivities)
app.get('/item', getAllItems)

app.post('/item', createItem)
app.post('/completed', createCompleted)
app.delete('/item/:id', deleteItem)



app.put('/item/:id', updateCompleteValue)


app.listen(SERVER_PORT, () => console.log(`Server running on port ${SERVER_PORT}`))