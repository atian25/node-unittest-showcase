import assert from 'assert/strict';
import request from 'supertest';

import { init } from '../lib/server.js';

describe('test/index.test.js', () => {
  it('should work', async () => {
    const app = init();
    await request(app.callback())
      .get('/')
      .expect(200, 'Hello World');
  });
});
