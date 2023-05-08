import fs from 'fs';
import fastify from 'fastify';
import cors from '@fastify/cors'
import { FastifySSEPlugin } from "fastify-sse-v2";

import { DATA } from './data';

const server = fastify({
  logger: true,
  http2: true,
  // HTTP2 is supported in all modern browsers only over a secure connection
  https: {
    key: fs.readFileSync('./localhost+2-key.pem'),
    cert: fs.readFileSync('./localhost+2.pem')
  },
});

server.register(cors, {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

server.register(FastifySSEPlugin);

server.get('/', (_req, res) => {
  res.send('Fastify + TypeScript server');
});

server.get('/api/stream', (req, res) => {
  res.header('Content-Type', 'text/event-stream')
  let timeout: NodeJS.Timeout;

  req.raw.on('close', () => {
    console.log('disconnected.')
    clearTimeout(timeout)  // prevent shutting down the connection twice
  })

  let i = 0;

  // console.log(`Percentage sent: 0%`);

  const push = () => {
    // console.log('push', i);
    if (i >= DATA.length) {
      console.log('end');
      clearTimeout(timeout);
      return;
    }
    // The double tilde operator '~~' truncates any decimal part of the number, effectively working as Math.floor()
    const end = i + ~~(Math.random() * 7 + 1);

    const percentageSent = (end / DATA.length) * 100;
    console.log(`Percentage sent: ${~~percentageSent}%`);

    // FIXME: send encoded string
    // const encodedString = new TextEncoder().encode(DATA.slice(i, end));
    // res.sse({ data: encodedString })

    res.sse({ data: DATA.slice(i, end) })

    // 10 second reconnect interval (how long will client wait before trying to reconnect).
    // res.sse({ data: DATA.slice(i, end), retry: 10000 })

    i = end;
    // const wait = ~~(Math.random() * 100 + 150)
    const wait = ~~(Math.random() * 100)
    timeout = setTimeout(push, wait);
  };

  push();
});

// Run the server and report out to the logs
server.listen(
  { port: parseInt(process.env.PORT || "5050", 10), host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);