# TashakkoriExpress

TashakkoriExpress is a lightweight, TypeScript-based web framework inspired by Express.js, designed to provide a simple yet powerful way to build web applications.

## Installation

To install TashakkoriExpress, use npm:

```sh
npm install tashakkoriexpress
```

## Getting Started

Create a new TashakkoriExpress app:

```ts
import alirezaexpress from 'tashakkoriexpress';

const app = alirezaexpress();

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

## Features

- Middleware support with `app.use()`
- Route handling for `GET`, `POST`, `PUT`, `DELETE`, and `ALL` methods
- Built-in response methods: `res.json()`, `res.redirect()`, `res.send()`
- Access query parameters via `req.query`
- Built-in static file serving

## API

### `app.use(middleware: Function)`
Registers a middleware function that runs before route handlers.

### `app.get(path: string, handler: Function)`
Handles `GET` requests for the specified path.

### `app.post(path: string, handler: Function)`
Handles `POST` requests for the specified path.

### `app.put(path: string, handler: Function)`
Handles `PUT` requests for the specified path.

### `app.delete(path: string, handler: Function)`
Handles `DELETE` requests for the specified path.

### `app.all(path: string, handler: Function)`
Handles `ALL` HTTP methods for the specified path.

### `res.json(data: any)`
Sends a JSON response.

### `res.redirect(url: string)`
Redirects the client to another URL.

### `res.send(data: any)`
Sends a response as plain text, JSON, or a buffer.

### `req.query`
Access query parameters from the request URL.

## Static Files

To serve static files, place them in a directory and use:

```ts
app.use(alirezaexpress.static('public'));
```

## Running the Server

```ts
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

## License

MIT

