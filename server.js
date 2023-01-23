const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
  console.log(`App running on ${PORT}`);
});

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// app.get('/signup', (request, response) => {});

// app.use(express.json());
// app.use(express.urlencoded({extended: true}));

//log events
// const logEvents = require('./logEvents');
// const EventEmitter = require('events');
// class Emitter extends EventEmitter {}
//initialize object
// const myEmitter = new Emitter();

// myEmitter.on('log', (msg) => logEvents(msg));

// myEmitter.emit('log', 'Log event emitted');
