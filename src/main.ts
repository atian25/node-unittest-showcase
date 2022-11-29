import { fileURLToPath } from 'url';
import Koa from 'koa';
import Router from '@koa/router';

export function init() {
  const app = new Koa();
  const router = new Router();

  app.use(async function auth(ctx, next) {
    // read user info from cookie
    console.log(ctx.cookies.get('user'));
    ctx.cookies.set('user', 'foo');
    await next();
  });

  app.use(router.routes());

  router.get('/login', async ctx => {
    ctx.body = `
      <form action="/login" method="post">
        <input type="text" name="username" />
        <input type="password" name="password" />
        <button type="submit">Login</button>
      </form>
    `;
  });

  router.post('/login', async ctx => {

  });

  router.get('/', async ctx => {
    ctx.body = 'Hello World';
  });


  return app;
}


// Determining if an ESM module is main then run the code
if (import.meta.url.startsWith('file:')) {
  const modulePath = fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    const app = init();
    app.listen(3000, () => {
      console.log('Server started at http://localhost:3000');
    });
  }
}
