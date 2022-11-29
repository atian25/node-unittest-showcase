export default () => {
  return async function notFound(ctx, next) {
    await next();

    if (!ctx.status || ctx.status === 404) {
      ctx.throw(404, 'Not Found');
    }
  };
};
