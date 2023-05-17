# Server-Sent Events

ChatGPT-like demo

## Get started

### Run React client (Vite)

```bash
cd client
npm install

# in watch mode
npm run dev
```

### Run Node.js server (fastify)

```bash
cd server
npm install

# in watch mode
npm run dev
```

## Resources

- <https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events>
- <https://blog.logrocket.com/using-fetch-event-source-server-sent-events-react/>

### Other

#### Streams API

> From Chromium 105, you can start a request before you have the whole body available by using the Streams API.
>
> You could use this to:
>
> - Warm up the server. In other words, you could start the request once the user focuses a text input field, and get all of the headers out of the way, then wait until the user presses 'send' before sending the data they entered.

- <https://live-samples.mdn.mozilla.net/en-US/docs/Web/API/Streams_API/Using_readable_streams/_sample_.example_async_reader.html>
- <https://developer.chrome.com/articles/fetch-streaming-requests/>

## Tech

### Client side

- <https://github.com/Azure/fetch-event-source>

### Service side

- fastify
- <https://github.com/nodefactoryio/fastify-sse-v2>

## Notes

- Chrome doesn't show `text/event-stream` events
<https://bugs.chromium.org/p/chromium/issues/detail?id=1025893>

## TODO

- [ ] send encoded characters so new lines are displayed. <https://github.com/claviering/ReadableStream-Demo/blob/main/src/pages/api/stream.ts>
- [ ] fix server `npm run build && npm run start`
