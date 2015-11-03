var ToDoBox = React.createClass({
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
        <ToDoList data={this.state.data} />
        <ToDoForm onToDoSubmit={this.handleToDoSubmit} />
      </div>
    );
  }
});

var ToDoItem = React.createClass({
  render: function() {
    return (
      <div className="toDoItem">
        <div className="toDoName">
          {this.props.name}
        </div>
        <button className="delete"></button>
      </div>
    );
  }
});

var ToDoList = React.createClass({
  render: function() {
    var todoNodes = this.props.data.map(function (todoItem) {
      return (
        <ToDoItem key={(+new Date() + Math.floor(Math.random() * 99))} name={todoItem.name}>
        </ToDoItem>
      );
    });
    return (
      <div className="toDoList">
        {todoNodes}
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
        <input type="text" placeholder="Add todo item" ref="name" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

ReactDOM.render(
  <ToDoBox url="/api/todos" />,
  document.getElementById('content')
);
