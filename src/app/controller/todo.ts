
import type { BaseContext } from 'koa';

interface Context extends BaseContext {
  request: {
    body?: any;
  };

  params?: Record<string, string>;
}

// 简化示例，直接全局变量存储数据。
import Todo from '../model/todo.js';
const db = new Todo();

// 查询列表，支持过滤 `/api/todo?completed=true`
export async function index(ctx: Context) {
  // query 参数均为字符串，需转换
  let completed: boolean;
  if (ctx.query.completed !== undefined) completed = ctx.query.completed === 'true';

  ctx.status = 200;
  ctx.body = await db.list({ completed });
}

// 创建任务
export async function create(ctx: Context) {
  // `ctx.request.body` 为 body-parser 中间件的产物
  const data = ctx.request.body;

  // 数据校验
  if (!data.title) ctx.throw(422, 'task title required');

  ctx.status = 201;
  ctx.body = await db.create(data);
}

// 修改任务
export async function update(ctx: Context) {
  // `ctx.request.body` 为 body-parser 中间件的产物
  const data = ctx.request.body;

  // 数据校验
  if (!data.title) ctx.throw(422, 'task title required');

  ctx.status = 204;
  ctx.body = await db.update(ctx.params.id, data);
}

// 删除操作
export async function destroy(ctx: Context) {
  // URL 匹配参数
  const id = ctx.params.id;
  ctx.status = 204;
  await db.destroy(id);
}
