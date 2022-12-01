import nock from 'nock';
import request from 'supertest';

describe('test/http.test.ts', () => {
  afterEach(() => nock.restore());

  it('should mock server response', async () => {
    // Mock 服务端响应
    nock('http://www.example.com')
      .post('/login')
      .reply((uri, requestBody) => {
        const { name, pwd } = requestBody as any;
        if (name && pwd === `${name}123`) {
          return [ 200, { token: 'abc' }];
        } else {
          return [ 401, { message: 'invalid name or pwd' }];
        }
      })
      .persist();

    // 发起请求测试，实际业务一般用 http.request 或 undici
    await request('http://www.example.com')
      .post('/login')
      .send({ name: 'tz', pwd: 'tz123' })
      .expect(200, { token: 'abc' });

    await request('http://www.example.com')
      .post('/login')
      .send({ name: 'tz', pwd: '' })
      .expect(401, { message: 'invalid name or pwd' });
  });
});
