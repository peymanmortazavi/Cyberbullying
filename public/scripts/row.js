var converter = new Showdown.converter();

var Comment = React.createClass({
    render: function() {
        var rawMarkup = converter.makeHtml(this.props.children.toString())
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    Username: {this.props.id}
                </h2>
                <p>Likes: {this.props.likes}</p>
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
            var commentNodes = this.props.data.map(function (comment) {
            var linkTo = "/form.html?id=" + comment.id
                return (
                  <div className="row">
                    <Comment id={comment.profile_owner_id} likes={comment.likes}className="col-md-6">
                        Likes: {comment.likes}
                    </Comment>
                    <a href={linkTo}>
                      <img src= {comment.image_url} className="col-md-2"/>
                    </a>
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
  <CommentBox url="cyberbullying.json" pollInterval={2000} />,
  document.getElementById('content')
)
