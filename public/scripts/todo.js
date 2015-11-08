// create parent component
var ToDoBox = React.createClass({

  delc: function(data_id) {
    // get the items from the state of the component
    var toDoItems = this.state.data;
    
    // remove item and return new list
    var newToDoItems = toDoItems.filter(function(elem) {
      return elem.id != data_id;
    });
    
    //update the state with the new list
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
  
  //handles the addition of items to the list
  handleToDoSubmit: function(toDoItem) {
    //update todo list before actually telling the server :)
    var toDoItems = this.state.data;
    
    //add new items
     var newToDoItems = toDoItems.concat([toDoItem]);
    
    //update state with new list
    this.setState({data: newToDoItems});
    
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify(toDoItem),
      contentType:"application/json; charset=utf-8",
      success: function(data) {
        //the post request returns a full list of todo items, set them
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  //setting initial state
  getInitialState: function() {
    return {data: []};
  },
  
  //run once after initial rendering
  componentDidMount: function() {
    // get all the items in the todo db
    $.ajax({
      //use url passed to the component
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        //when the state updates, the component re-renders itself
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
        
      }.bind(this) //the bind will ensure 'this' will be the correct object inside the callback
    });
  },
  // all components must implement a render method
  render: function() {
    return (
      <div className="toDoBox">
        <h1>ToDo</h1>
         {/*ToDoBox owns these components
         Data passed in is a 'property' on the child component
         We are passing in a new callback (handleToDoSubmit) into the child
         Binding into the child's onToDoSubmit event*/}
        <ToDoForm onToDoSubmit={this.handleToDoSubmit} />
        <ToDoList del={this.delc} data={this.state.data} />
      </div>
    );
  }
});

var ToDoList = React.createClass({
  //not sure this is the best way to handle this, but I just keep delegating handling of the event 
  //up the component tree until we get to the component that owns the state.
  handleDelete: function(toDoItemId){
    return this.props.del(toDoItemId);
  },
  render: function() {
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
    // dont submit the form and reload page
    e.preventDefault();
    
    //this.refs is a reference to the DOM node
    var name = this.refs.name.value.trim();
    if (!name) {
      return;
    }
    
    // reference to the parent prop function 'onToDoSubmit'
    this.props.onToDoSubmit({name: name});
    
    //empty the text input field af submission
    this.refs.name.value = '';
    return;
  },
  render: function() {
    return (
      // attach onSubmit handler
      <form className="toDoForm" onSubmit={this.handleSubmit}>
        {/* ref attribute to assign a name to a child component*/}
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
