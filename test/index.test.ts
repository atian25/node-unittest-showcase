import assert from 'assert/strict';
import request from 'supertest';

import { init } from '../src/main.js';

describe('test/index.test.ts', () => {
  const app = init();

  it('should redirect to /login', async () => {
    await request(app.callback())
      .get('/')
      .expect(302)
      .expect('Location', '/login');
  });

  it('should show login form', async () => {
    await request(app.callback())
      .get('/login')
      .expect(200, /UserName: /)
  });


  it('should login fail', async () => {
    await request(app.callback())
      .post('/login')
      .type('form')
      .send({ username: 'bad', password: '123456' })
      .expect(401);
  });

  it('should login success', async () => {
    let cookie;
    await request(app.callback())
      .post('/login')
      .type('form')
      .send({ username: 'tz', password: 'tz123456' })
      .expect(302)
      .expect('Location', '/')
      .expect('Set-Cookie', /koa.sess=/)
      .then(res => {
        cookie = res.headers['set-cookie'];
      });

    await request(app.callback())
      .get('/')
      .set('Cookie', cookie)
      .expect(200, /Hi, tz/)
      .then(res => {
        assert(!res.text.includes('All Users: '));
      });
  });

  it('should login success with admin', async () => {
    let cookie;

    await request(app.callback())
      .post('/login')
      .type('form')
      .send({ username: 'admin', password: 'admin123456' })
      .expect(302)
      .expect('Location', '/')
      .expect('Set-Cookie', /koa.sess=/)
      .then(res => {
        cookie = res.headers['set-cookie'];
      });

    await request(app.callback())
      .get('/')
      .set('Cookie', cookie)
      .expect(200, /Hi, admin/)
      .expect(/All Users:/);
  });

  it('should logout', async () => {
    let cookie;
    await request(app.callback())
      .post('/login')
      .type('form')
      .send({ username: 'tz', password: 'tz123456' })
      .expect(302)
      .expect('Location', '/')
      .expect('Set-Cookie', /koa.sess=/)
      .then(res => {
        cookie = res.headers['set-cookie'];
      });

    await request(app.callback())
      .get('/')
      .set('Cookie', cookie)
      .expect(200, /Hi, tz/);

    await request(app.callback())
      .get('/logout')
      .expect(302)
      .expect('Location', '/login')
      .then(res => {
        cookie = res.headers['set-cookie'];
        assert(cookie[0].startsWith('koa.sess=;'));
      })
  });
});
