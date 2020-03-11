const express = require('express'); // loads module 'express'
const app = express(); 

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // review pathnames before submission
});

app.use('/static', express.static(__dirname + '/public'));

const server = app.listen(7000, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});


