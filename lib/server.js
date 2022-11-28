import Koa from 'koa';
import Router from '@koa/router';

export function init() {
  const app = new Koa();
  const router = new Router();
  app.use(router.routes());

  router.get('/', async ctx => {
    ctx.body = 'Hello World';
  });


  return app;
}
