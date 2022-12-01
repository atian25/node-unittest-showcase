import { fileURLToPath } from 'url';
import path from 'path';

import { dirname } from 'dirname-filename-esm';
import Koa from 'koa';
import Router from '@koa/router';
import staticCache from 'koa-static-cache';
import { koaBody } from 'koa-body';

// 引入 Middleware
import accessLog from './app/middleware/access_log.js';
import notFound from './app/middleware/not_found.js';
import errorHandler from './app/middleware/error_handler.js';
import cors from './app/middleware/cors.js';

// 引入 Controller
import home from './app/controller/home.js';
import * as todo from './app/controller/todo.js';

// 实例化应用
const app = new Koa();

// 静态资源
app.use(staticCache({
  prefix: '/public',
  dir: path.join(dirname(import.meta), './app/public'),
  dynamic: true,
  preload: false,
}));

app.use(accessLog()); // 打印访问日志
app.use(errorHandler()); // 错误处理
app.use(koaBody()); // Body 解析
app.use(notFound()); // 未匹配路由兜底处理

// 路由映射
const router = new Router();

router.get('/', home);
router.use('/api/', cors({ origin: '*' })); // 打印跨域头
router.get('/api/todo', todo.index);
router.post('/api/todo', todo.create);
router.put('/api/todo/:id', todo.update);
router.delete('/api/todo/:id', todo.destroy);

// 挂载路由，路由本质上也只是一个中间件，故应该放在最后面挂载。
app.use(router.routes());

// 直接执行的时候，启动服务
/* c8 ignore start */
if (import.meta.url.startsWith('file:')) {
  const modulePath = fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    app.listen(3000, () => {
      console.log('Server started at http://localhost:3000');
    });
  }
}
/* c8 ignore stop */

export default app;
