import assert from 'assert/strict';
import sinon from 'sinon';

describe('test/mock.test.ts', () => {
  const sandbox = sinon.createSandbox();
  beforeEach(() => sandbox.spy(console));
  afterEach(() => sandbox.restore() && sinon.restore());

  it('should mock', () => {
    const obj = {
      sayHi(name: string) {
        console.log(`Hi, ${name}`);
      },
      uuid(name: string) {
        return name + Date.now();
      },
    };

    // 验证特定函数是否被调用
    obj.sayHi('egg');
    assert((console.log as any).calledWith('Hi, egg'));

    // 模拟下游依赖的返回，方便测试验证
    sinon.stub(Date, 'now').returns(123456);
    assert(obj.uuid('egg') === 'egg123456');
  });
});
