import assert from 'assert/strict';
import request from 'supertest';
import app from '../src/index.js';

describe('test/index.test.ts', () => {
  it('should GET /', async () => {
    await request(app.callback())
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200);
  });

  it('should list todo', async () => {
    await request(app.callback())
      .get('/api/todo')
      .expect('Content-Type', /json/)
      .expect('X-Response-Time', /\d+ms/)
      .expect(200)
      .then(res => {
        assert(res.body[0].title.includes('Node.js'));
      });
  });

  it('should GET list with filter: completed=false', async () => {
    await request(app.callback())
      .get('/api/todo')
      .query({ completed: false })
      .expect('Content-Type', /json/)
      .expect('X-Response-Time', /\d+ms/)
      .expect(200)
      .then(res => {
        assert(res.body[0].title.includes('Egg'));
      });
  });

  it('should add todo', async () => {
    await request(app.callback())
      .post('/api/todo')
      .send({ title: 'Add one' })
      .expect('Content-Type', /json/)
      // .expect('X-Response-Time', /\d+ms/)
      .expect(201)
      .then(res => {
        assert(res.body.id);
        assert(res.body.title === 'Add one');
        assert(res.body.completed === false);
      });
  });

  it('should add todo fail', async () => {
    await request(app.callback())
      .post('/api/todo')
      .send({ title: undefined })
      .expect(422)
      .expect({ message: 'task title required' });
  });

  it('should update todo', async () => {
    await request(app.callback())
      .put('/api/todo/1')
      .send({ id: '1', title: 'Modify Node.js' })
      .expect('X-Response-Time', /\d+ms/)
      .expect(204);

    // validate
    await request(app.callback())
      .get('/api/todo')
      .expect(200)
      .then(res => {
        assert(res.body[0].title === 'Modify Node.js');
      });
  });

  it('should update todo fail', async () => {
    await request(app.callback())
      .put('/api/todo/999')
      .send({ id: '1', title: undefined })
      .expect(422)
      .expect({ message: 'task title required' });
  });

  it('should update todo fail with not found', async () => {
    await request(app.callback())
      .put('/api/todo/999')
      .send({ id: '999', title: 'Modify Node.js' })
      .expect(500)
      .expect({ message: 'task#999 not found' });
  });


  it('should delete todo', async () => {
    await request(app.callback())
      .delete('/api/todo/1')
      .expect(204);

    // validate
    await request(app.callback())
      .get('/api/todo')
      .expect('X-Response-Time', /\d+ms/)
      .expect(200)
      .then(res => {
        assert(res.body[0].title.includes('Koa'));
      });
  });

  it('should delete todo fail', async () => {
    await request(app.callback())
      .delete('/api/todo/999')
      .expect(500)
      .expect({ message: 'task#999 not found' });
  });

  it('should 404', async () => {
    await request(app.callback())
      .get('/no_exist')
      .expect(404)
      .expect('Not Found');
  });

  it('should serve static', async () => {
    await request(app.callback())
      .get('/public/main.js')
      .expect(200);
  });

  it('should support cors', async () => {
    await request(app.callback())
      .get('/api/todo')
      .expect('Access-Control-Allow-Origin', '*');

    await request(app.callback())
      .get('/')
      .then(res => {
        assert(!res.headers['Access-Control-Allow-Origin']);
      });
  });
});
