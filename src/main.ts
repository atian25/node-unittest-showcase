import { fileURLToPath } from 'url';
import Koa from 'koa';
import Router from '@koa/router';
import session from 'koa-session';
import { koaBody } from 'koa-body';

export function init() {
  const app = new Koa();
  const router = new Router();

  const userList = [ 'tz', 'egg', 'admin', 'guest' ];

  app.keys = [ '123456' ];
  app.use(session(app));
  app.use(koaBody());
  app.use(router.routes());

  router.use(async function auth(ctx, next) {
    if (ctx.path === '/login' || ctx.path === '/logout') return await next();
    if (ctx.session.user) return await next();
    return ctx.redirect('/login');
  });

  router.get('/login', async ctx => {
    ctx.body = `
      <html>
        <head><title>UnitTest Showcase</title></head>
        <body>
          <form action="/login" method="post">
            UserName: <input type="text" name="username" autofocus /> <br />
            Password: <input type="password" name="password" /> <br />
            <button type="submit">Login</button>
          </form>
        </body>
      </html>
    `;
  });

  router.get('/logout', async ctx => {
    ctx.session = null;
    ctx.redirect('/login');
  });

  router.post('/login', async ctx => {
    const { username, password } = ctx.request.body;
    console.log(`login with username: ${username}`);
    if (userList.includes(username) && password === `${username}123456`) {
      ctx.session.user = {
        username,
        isAdmin: username === 'admin',
      };
      ctx.redirect('/');
    } else {
      ctx.status = 401;
    }
  });

  router.get('/', async ctx => {
    const { username, isAdmin } = ctx.session.user;
    console.log(username, isAdmin);

    if (isAdmin) {
      ctx.body += '<ul>' + userList.map(name => `<li>${name}</li>`).join('') + '</ul>';
    }

    ctx.body = `
      <html>
        <head><title>UnitTest Showcase</title></head>
        <body>
          Hi, ${username} <a href="/logout">Logout</a><br />
          ${ isAdmin ? '<hr /> All Users: <br/> <ul>' + userList.map(name => `<li>${name}</li>`).join('') + '</ul>' : '' }
        </body>
      </html>`;
    ctx.type = 'html';
  });

  return app;
}


// Determining if an ESM module is main then run the code
/* c8 ignore start */
if (import.meta.url.startsWith('file:')) {
  const modulePath = fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    const app = init();
    app.listen(3000, () => {
      console.log('Server started at http://localhost:3000');
    });
  }
}
/* c8 ignore stop */
