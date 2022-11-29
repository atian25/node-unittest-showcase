import fs from 'fs/promises';
import path from 'path';
import { dirname } from 'dirname-filename-esm';
import type { BaseContext } from 'koa';

export default async (ctx: BaseContext) => {
  // 注意：此处为简化示例，一般需要缓存
  const html = await fs.readFile(path.join(dirname(import.meta), '../view/index.html'));
  ctx.type = 'html';
  ctx.body = html;
};
