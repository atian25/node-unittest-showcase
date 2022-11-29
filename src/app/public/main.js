/* global Vue:false, axios:false */
/* eslint object-shorthand: 0 */

new Vue({
  el: '#app',
  data: {
    todoList: [],
    newTodo: '',
    completed: 'all',
  },
  methods: {
    listData: function(completed) {
      // 简化处理，忽略错误处理和加载提示
      axios.get('/api/todo', { params: { completed } })
        .then(res => {
          this.todoList = res.data;
        });
    },

    addTodo: function() {
      const value = this.newTodo && this.newTodo.trim();
      if (!value) return;

      const item = {
        title: value,
        completed: false,
      };

      axios.post('/api/todo', item)
        .then(res => {
          this.todoList.push(res.data);
          this.newTodo = '';
        });
    },

    completeTodo: function(todo) {
      todo.completed = !todo.completed;
      axios.put(`/api/todo/${todo.id}`, todo)
        .then(() => {
          this.newTodo = '';
        });
    },

    removeTodo: function(todo) {
      axios.delete(`/api/todo/${todo.id}`)
        .then(() => {
          const index = this.todoList.findIndex(x => x.id === todo.id);
          this.todoList.splice(index, 1);
        });
    },
  },

  mounted() {
    this.listData();
  },
});
