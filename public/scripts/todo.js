var ToDoBox = React.createClass({
  delc: function(data_id) {
    var toDoItems = this.state.data;
    var newToDoItems = toDoItems.filter(function(elem) {
      return elem.id != data_id;
    });
    this.setState({data: newToDoItems});

    $.ajax({
      type: 'DELETE',
      url: this.props.url +'/'+ data_id,
      success: function() {
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleToDoSubmit: function(toDoItem) {
    //update todo list before actually sending to server :)
    var toDoItems = this.state.data;
    var newToDoItems = toDoItems.concat([toDoItem]);
    this.setState({data: newToDoItems});
    
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify(toDoItem),
      contentType:"application/json; charset=utf-8",
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="toDoBox">
        <h1>ToDo</h1>
        <ToDoForm onToDoSubmit={this.handleToDoSubmit} />
        <ToDoList del={this.delc} data={this.state.data} />
      </div>
    );
  }
});

var ToDoList = React.createClass({
  handleDelete: function(toDoItemId){
    return this.props.del(toDoItemId);
  },
  render: function() {
    var onDelete = this.props.onDelete;
    var todoNodes = this.props.data.map(function (todoItem) {
      return (
        <ToDoItem onDelete={this.handleDelete} key={(+new Date() + Math.floor(Math.random() * 99))} todoitem={todoItem}>
        </ToDoItem>
      );
    }, this);
    return (
      <div className="toDoList">
        {todoNodes}
      </div>
    );
  }
});

var ToDoItem = React.createClass({
  handleClick: function(e){
    e.preventDefault();
    var toDoItemId = this.props.todoitem.id;
    return this.props.onDelete(toDoItemId);
  },
  render: function() {
    return (
      <div className="toDoItem">
        <button onClick={this.handleClick} className="delete"></button>
        <div className="toDoName">
          {this.props.todoitem.name}
        </div>
      </div>
    );
  }
});

var ToDoForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var name = this.refs.name.value.trim();
    if (!name) {
      return;
    }
    this.props.onToDoSubmit({name: name});
    this.refs.name.value = '';
    return;
  },
  render: function() {
    return (
      <form className="toDoForm" onSubmit={this.handleSubmit}>
        <input type="text" autoFocus ref="name" />
        <input type="submit" className="toDoSubmit" value="Tilføj" />
      </form>
    );
  }
});

ReactDOM.render(
  <ToDoBox url="/api/todos" />,
  document.getElementById('content')
);
