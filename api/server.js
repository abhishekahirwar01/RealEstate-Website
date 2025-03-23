const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Welcome abhi')
})

app.listen(3000, ()=>{
    console.log("Server is running port on 3000")
})