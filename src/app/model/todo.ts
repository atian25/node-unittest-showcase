interface TodoItem {
  id: string;
  title: string;
  completed?: boolean;
}

export default class TodoStore {
  constructor(private store: TodoItem[] = []) {}

  // 查询任务列表，支持可选过滤参数 { completed }
  async list(filters: { completed?: boolean } = {}) {
    const { completed } = filters;
    let list = this.store;
    if (completed !== undefined) {
      list = list.filter(x => x.completed === completed);
    }
    return list;
  }

  // 查询任务对象，找不到对象会抛错
  async get(id: string) {
    const index = id ? this.store.findIndex(x => x.id === id) : -1;
    if (index === -1) throw new Error(`task#${id} not found`);
    return this.store[index];
  }

  // 添加任务，会校验 title 属性
  async create(todo: Partial<TodoItem>): Promise<TodoItem> {
    // 校验数据
    if (!todo.title) throw new Error('task title required');

    // 补全数据，保存
    todo.id = Date.now().toString();
    todo.completed = false;
    this.store.push(todo as TodoItem);
    return todo;
  }

  // 修改任务，找不到对象会抛错
  async update(id: string, todo: Partial<TodoItem>): Promise<TodoItem> {
    // 检查是否存在
    const data = await this.get(id);
    if (!todo.title) throw new Error('task title required');

    // 修改 todo 对象，并更新状态
    return Object.assign(data, todo);
  }

  // 删除任务，找不到对象会抛错
  async destroy(id: string) {
    const index = id ? this.store.findIndex(x => x.id === id) : -1;
    if (index === -1) throw new Error(`task#${id} not found`);

    // 删除对象
    return this.store.splice(index, 1)[0];
  }
}
