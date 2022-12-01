import { test, expect } from '@playwright/test';
import app from '../../src/index.js';

let server;
test.beforeAll(async () => {
  await new Promise(resolve => {
    server = app.listen(7001, () => {
      console.log('Server is running on http://localhost:7001');
      resolve(server);
    });
  });
});

test.afterAll(async () => {
  await new Promise(resolve => server.close(resolve as any));
});

test('should work with todo', async ({ page }) => {
  const selector = '.todo-list .todo label';
  await page.goto('http://localhost:7001/');
  await expect(page).toHaveTitle(/TodoMVC/);

  // create a new todo locator
  const newTodo = page.getByPlaceholder('What needs to be done?');

  // create a todo.
  await newTodo.type('Write a unittest');
  await newTodo.press('Enter');

  // validate the todo is created
  await expect(page.locator(selector)).toHaveText([
    'Read history of Node.js',
    'Learn Koa',
    'Star Egg',
    'Write a unittest',
  ]);

  await page.waitForTimeout(500);

  // filter the todos
  await page.getByText('Completed').click();
  await expect(page.locator(selector)).toHaveText([
    'Read history of Node.js',
    'Learn Koa',
  ]);

  await page.waitForTimeout(500);

  await page.getByText('Active').click();
  await expect(page.locator(selector)).toHaveText([
    'Star Egg',
    'Write a unittest',
  ]);
});
