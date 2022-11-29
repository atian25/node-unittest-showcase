import assert from 'assert/strict';
import request from 'supertest';

import { init } from '../src/main.js';

describe('test/index.test.ts', () => {
  it('should work', async () => {
    const app = init();
    await request(app.callback())
      .get('/')
      .expect(200, 'Hello World')
      .then(res => {
        console.log(res.headers);
      });
  });
});
