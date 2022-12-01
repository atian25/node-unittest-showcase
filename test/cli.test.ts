import { runner } from 'clet';

describe('test/cli.test.ts', () => {
  it('should works with boilerplate', async () => {
    await runner()
      .cwd('./test/tmp', { init: true })
      .spawn('npm init', [], {})
      .stdin(/name:/, 'example') // 模拟用户输入
      .stdin(/version:/, new Array(9).fill('\n'))
      .stdout(/"name": "example"/) // 验证命令行终端日志输出
      .notStderr(/npm ERR/)
      .file('package.json', { name: 'example', version: '1.0.0' }); // 验证文件内容
  });
});
