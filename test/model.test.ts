import assert from 'assert/strict';
import Todo from '../src/app/model/todo.js';

describe('test/model.test.ts', () => {
  it('should create todo', async () => {
    const db = new Todo();
    const todo = await db.create({ title: 'test' });
    assert(todo.id);
    assert(todo.title === 'test');
    assert(!todo.completed);

    const todo2 = await db.get(todo.id);
    assert(todo2.title === 'test');

    const todos = await db.list();
    assert(todos.length === 1);
  });

  it('should create todo fail when missing title', async () => {
    await assert.rejects(async () => {
      const db = new Todo();
      await db.create({});
    }, /task title required/);
  });
});
