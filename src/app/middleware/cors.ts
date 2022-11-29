export interface CorsOptions {
  origin?: string;
}

export default (options?: CorsOptions) => {
  /* c8 ignore next */
  const origin = options.origin || '*';

  return async function cors(ctx, next) {
    await next();
    ctx.set('Access-Control-Allow-Origin', origin);
  };
};
