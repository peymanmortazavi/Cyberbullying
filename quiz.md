# Comment

```javascript
var converter = new Showdown.converter();
var Comment = React.createClass({
  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});
```
### Q1: Where does the value of ``this.props.author`` get specified?

In the JSON file, each element’s author field.

### Q2: Where does the value of ``this.props.children`` get specified?

{{ your answer here }}


### Q3: What does ``className="comment"`` do?

Sets the div’s class in HTML.

### Q4: What is ``dangerouslySetInnerHTML``? Why is it such a long word for an API method?

By default react escapes html to prevent xss.  This allows rendering HTML.

It is a long word because this a dangerous operation and should not be done unless you are sure you are being secure.


# CommentBox
```javascript
var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

```

### Q5: How does ``$`` get defined? Is it part of the ReactJS framework?

The $ is jquery which has nothing to do with react.  It is defined in public/index.html as a script import.

### Q6: Where does the value of ``this.props.url`` get specified?

It gets specified in the react.render of <CommentBox url=x />


### Q7: What would happen to the statement ``this.setState`` if ``bind(this)`` is removed? Why?

{{your answer here}}

### Q8: Who calls ``loadCommentsFromServer``? When? 

{{your answer here}}


```javascript
	
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    comments.push(comment);
    this.setState({data: comments}, function() {
      // `setState` accepts a callback. To avoid (improbable) race condition,
      // `we'll send the ajax request right after we optimistically set the new
      // `state.
      $.ajax({
        url: this.props.url,
        dataType: 'json',
        type: 'POST',
        data: comment,
        success: function(data) {
          this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});
```

### Q9: What is the purpose of ``this.state``? How is this different from ``this.props``?

{{your answer here}}

### Q10: What is the initial value of ``this.state.data``? How is the initial value specified?

{{your answer here}}


### Q11: What is the new value of ``this.state.data``? How is this new value set?

{{your answer here}}


### Q12: What is the purpose of ``componentDidMount`` callback?

{{your answer here}}

### Q13: What is the purpose of ``getInitialState``?

{{your answer here}}


# CommentList

```javascript

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment, index) {
      return (
        // `key` is a React-specific concept and is not mandatory for the
        // purpose of this tutorial. if you're curious, see more here:
        // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
        <Comment author={comment.author} key={index}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});
```
### Q14: How does the value of ``this.props.data`` get set?

{{your answer here}}

### Q15: What is the value of ``commentNodes``?

{{your answer here}}

### Q16: Where does the value of ``{comment.text}`` go on the rendered page?

{{your answer here}}

# CommentForm
```javascript

var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    if (!text || !author) {
      return;
    }
    this.props.onCommentSubmit({author: author, text: text});
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />
        <input type="text" placeholder="Say something..." ref="text" />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

React.render(
  <CommentBox url="comments.json" pollInterval={2000} />,
  document.getElementById('content')
);
```

### Q17: What is the purpose of ``e.preventDefault()``?

{{answer here}}

### Q18: What is the value of ``this.props.onCommentSubmit``? What does it get specified?

{{answer here}}

### Q19: Where does ``this.refs.author`` point to?

{{answer here}}

### Q20: What does ``getDOMNode()`` do?

{{answer here}}
