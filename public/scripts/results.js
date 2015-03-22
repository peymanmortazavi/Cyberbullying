var converter = new Showdown.converter();

var Comment = React.createClass({
    render: function() {
        var children = this.props.children;
        return (
            <div className="comment container-fluid">
                <h2 className="commentAuthor">
                    {this.props.id}
                </h2>
                <p> Answer to Q1: {this.props.q1}</p>
                <p> Answer to Q2: {this.props.q2}</p>
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
            var commentNodes = this.props.data.map(function (comment) {
                return (
                  <div className="container-fluid">
                    <Comment id={"Photo Id: " + comment.postId} q1={comment.q1} q2={comment.q2} className="col-md-6">
                    </Comment>
                  </div>
                );
            });
            return (
                <div className="commentList">
                    {commentNodes}
                </div>
            );
    }
});

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
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    handleCommentSubmit: function(comment) {
        var comments = this.state.data;
        var newComments = comments.concat([comment]);
        this.setState({data: newComments});
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
    },

  render: function() {
    return (
      <div className="commentBox">
        <h1>Welcome to the CyberBullying Survey</h1>
        <CommentList data={this.state.data} />
      </div>
    );
  }
});

React.render(
  <CommentBox url="comments.json" pollInterval={2000} />,
  document.getElementById('content')
)
