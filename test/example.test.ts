import assert from 'assert/strict';

describe('test/example.test.ts', () => {
  // 生命周期钩子
  before(() => console.log('before'));
  after(() => console.log('before'));
  beforeEach(() => console.log('beforeEach'));
  afterEach(() => console.log('afterEach'));

  // 使用断言
  it('should work', async () => {
    assert(1 + 1 === 2);
  });

  // 验证错误分支
  it('should fail', async () => {
    await assert.rejects(async () => {
      throw new Error('this is an error');
    }, /an error/);
  });
});
