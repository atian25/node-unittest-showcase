import type { BaseContext, Next } from 'koa';

export default () => {
  return async function notFound(ctx: BaseContext, next: Next) {
    await next();

    if (!ctx.status || ctx.status === 404) {
      ctx.throw(404, 'Not Found');
    }
  };
};
