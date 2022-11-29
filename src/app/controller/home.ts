import fs from 'fs/promises';
import path from 'path';
import { dirname } from 'dirname-filename-esm';

export default async ctx => {
  // 注意：此处为简化示例，一般需要缓存
  const html = await fs.readFile(path.join(dirname(import.meta), '../view/index.html'));
  ctx.type = 'html';
  // ctx.set('Content-Type', 'text/html');
  ctx.body = html;
};
