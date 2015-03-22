var converter = new Showdown.converter();

var Comment = React.createClass({
    render: function() {
       
       var comment = this.props.data;
        return (
           <a href={"/form.html?id=" + comment.id}>
            <div className="container-fluid comment">
               <div className="col-md-8">
                  <h3>{comment.profile_owner_id }</h3>
                  <h5>{comment.owner_caption}</h5>
           <p>
                  {comment.likes} 
                  <img src="http://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Heart_coraz%C3%B3n.svg/2000px-Heart_coraz%C3%B3n.svg.png" style={{"width":"16px", "margin":"5px"}}/>
           </p>
               </div>
               <div className="col-md-4" style={{"text-align":"right"}}>
                  <img src={comment.image_url} className="picture" />
               </div>
            </div>
           </a>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
            var commentNodes = this.props.data.map(function (comment) {
                return <Comment data={comment} />;
            });
            return (
                <div>
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
