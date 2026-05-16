const express = require('express');
const amqp = require('amqplib');
const cors = require('cors');

const app = express();

app.use(cors());

let messages = [];

async function start() {

  const connection =
    await amqp.connect('amqp://rabbitmq');

  const channel =
    await connection.createChannel();

  await channel.assertQueue('messages');

  channel.consume('messages', (msg) => {

    const text =
      msg.content.toString();

    console.log('Received:', text);

    messages.push(text);

    channel.ack(msg);

  });

}

start();

app.get('/messages', (req, res) => {

  res.json(messages);

});

app.listen(3002, () => {

  console.log('WEB2 started');

});