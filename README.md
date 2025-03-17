# TashakkoriExpress

TashakkoriExpress is a lightweight, TypeScript-based web framework inspired by Express.js. It provides an easy-to-use API for building web applications with minimal setup.

## Installation

Install TashakkoriExpress using npm:

```sh
npm install tashakkoriexpress
```

## Features

- **Middleware support** (`app.use()`) for request processing.
- **Route handling** for `GET`, `POST`, `PUT`, `DELETE`, and `ALL` methods.
- **Built-in response methods** like `res.json()`, `res.redirect()`, `res.send()`.
- **Query parameter access** via `req.query`.
- **Static file serving** with `app.use(tashakkoriexpress.static('public'))`.
- **Error handling** with custom middleware.

## API
## Getting Started


```ts
import { tashakkoriexpress, Request, Response, NextFunction } from 'tashakkoriexpress';
import path from 'path';

const Logger = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const Middleware = (req: Request, res: Response, next: NextFunction): void => {
  console.log('this is another middleware');
  next();
};

const app = tashakkoriexpress();
app.use(Logger);
app.use(app.json());

app.use('/files', app.static(path.join(__dirname, 'public')));
console.log(path.join(__dirname, 'public')); // http://localhost:3000/static


app.get('/', (req: Request, res: Response): void => {
  res.status(200);
  res.send('Hello, world!');
});

app.get('/user', Middleware, (req: Request, res: Response): void => {
  const { name } = req.query;
  res.status(200);
  res.json({ name: name });
}); // http://localhost:3000/user?name=Alireza

app.post('/data', (req: Request, res: Response): void => {
  res.status(200);
  res.json(req.body);
}); // {"username": "Alireza", "age": 25}

app.delete('/data', (req: Request, res: Response): void => {
  res.status(200);
  res.send(`Received delete method on /data`);
});

app.get('/redirect', (req: Request, res: Response): void => {
  res.redirect('https://www.example.com');
});

app.get(
  '/test/:id/code/:newID',
  Middleware,
  (req: Request, res: Response): void => {
    const { id, newID } = req.params;
    res.status(200);
    res.send(`test number: ${id}, newID: ${newID}`);
  }
); // http://localhost:3000/test/123/code/456

app.all('*', (req: Request, res: Response, next: NextFunction): void => {
  next(new Error('Route not found'));
});


const uploadFileMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  console.log('File uploaded');
  next();
};

app.post('/upload', uploadFileMiddleware, (req: Request, res: Response): void => {
  res.status(200);
  res.send('File uploaded successfully');
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

```
