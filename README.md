# TashakkoriExpress

TashakkoriExpress is a lightweight, TypeScript-based web framework inspired by Express.js. It provides an easy-to-use API for building web applications with minimal setup.

## Installation

Install TashakkoriExpress using npm:

```sh
npm install tashakkoriexpress
```

## Getting Started

Create a simple web server using TashakkoriExpress:

```ts
import tashakkoriexpress from 'tashakkoriexpress';

const app = tashakkoriexpress();

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

## Features

- **Middleware support** (`app.use()`) for request processing.
- **Route handling** for `GET`, `POST`, `PUT`, `DELETE`, and `ALL` methods.
- **Built-in response methods** like `res.json()`, `res.redirect()`, `res.send()`.
- **Query parameter access** via `req.query`.
- **Static file serving** with `app.use(tashakkoriexpress.static('public'))`.
- **Error handling** with custom middleware.

## API

### Routing Methods

#### `app.use([path], middleware)`
Registers a global middleware or a middleware for a specific path.

```ts
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});
```

#### `app.get(path, handler)`
Handles `GET` requests.

```ts
app.get('/users', (req, res) => {
  res.json({ users: ['Alice', 'Bob'] });
});
```

#### `app.post(path, handler)`
Handles `POST` requests.

```ts
app.post('/users', (req, res) => {
  res.json({ message: 'User created successfully' });
});
```

#### `app.put(path, handler)`
Handles `PUT` requests.

```ts
app.put('/users/:id', (req, res) => {
  res.json({ message: `User ${req.params.id} updated` });
});
```

#### `app.delete(path, handler)`
Handles `DELETE` requests.

```ts
app.delete('/users/:id', (req, res) => {
  res.json({ message: `User ${req.params.id} deleted` });
});
```

#### `app.all(path, handler)`
Handles all HTTP methods.

```ts
app.all('/any-method', (req, res) => {
  res.send(`Handled ${req.method} request`);
});
```

### Request and Response Helpers

#### `req.query`
Access query parameters:

```ts
app.get('/search', (req, res) => {
  res.json({ query: req.query });
});
```

#### `res.json(data)`
Send a JSON response:

```ts
app.get('/data', (req, res) => {
  res.json({ key: 'value' });
});
```

#### `res.redirect(url)`
Redirect to another URL:

```ts
app.get('/google', (req, res) => {
  res.redirect('https://www.google.com');
});
```

#### `res.send(data)`
Send text, JSON, or buffer data:

```ts
app.get('/message', (req, res) => {
  res.send('Hello, this is a simple message!');
});
```

## Serving Static Files

To serve static files from a directory:

```ts
app.use(tashakkoriexpress.static('public'));
```

Now, any file in the `public` folder can be accessed via the browser.

## Error Handling

Add a custom error handler:

```ts
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});
```

## Running the Server

Start the server with:

```ts
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```



