const express = require('express'); // loads module 'express'
const app = express(); 


app.use(express.static("public"));

const server = app.listen(7000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});


