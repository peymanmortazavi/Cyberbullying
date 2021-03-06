var converter = new Showdown.converter();

var Comment = React.createClass({
    render: function() {
       var comment = this.props.data;
        return (
            <div className="subComment container-fluid">
           <div className="col-md-8">
               <h5><b>{comment.user_id}</b></h5>
               <p>
                  <h5>{comment.comment}</h5>
               </p>
           </div>
           <div className="col-md-4" style={{"text-align": "right"}}>
           {comment.creation_time.replace("created_at:","")}
           </div>
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
            var url = document.URL;
            var id = (url).split('=')[1];
            var commentNodes = this.props.data.map(function (comment) {
            if (comment.id == id) {
               //return <p>nope</p>
//                var comments = comment.comments.map(function (myComment) {
//                  return (
//                    <div class="row">
//                      <p>User: {myComment.user_id}</p>
//                      <p>{myComment.comment}</p>
//                      <p>Creation_time: {myComment.creation_time}</p>
//                      <hr/>
//                    </div>
//                  )
//                })
//                return (
//                  <div className="row">
//                    <Comment id={comment.profile_owner_id} className="col-md-6">
//                        Likes: {comment.likes}
//                    </Comment>
//                    <a>
//                      <img src= {comment.image_url} className="col-md-2"/>
//                    </a>
//                      {comments}
//                  </div>
//                );
               
                  var comments = comment.comments.map(function(userComment){
                     
                     return <Comment data={userComment} />
                     
                  });
               
                  return (<div>
                     <div className="container-fluid comment header">
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
                          {comments}
                          </div>);
            }
            else {
              return (<div/>)
            }
            });
            return (
                <div className="commentList">
                    {commentNodes}
                </div>
            );
    }
});

var DawsCommentBox = React.createClass({
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

    render: function() {
    return (
      <div className="commentBox">
        <h1>Welcome to the CyberBullying Survey</h1>
        <CommentList data={this.state.data} />
      </div>
    );
  }
});

var CommentForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();

        // Get values of radios (maybe a better way to do this....)
        var q1no = this.refs.q1no.getDOMNode().checked;
        var q1yes = this.refs.q1yes.getDOMNode().checked;
        var q2no = this.refs.q2no.getDOMNode().checked;
        var q2yes = this.refs.q2yes.getDOMNode().checked;

        // Ensure both fields filled out
        if ((!q1no && !q1yes) || (!q2no && !q2yes)){
            console.log("form not filled out correctly");
            return;
        }

        // Correctly set output result
        var q1Result= 'no';
        var q2Result = 'no';

        if(q1yes) q1Result = 'yes';
        if(q2yes) q2Result = 'yes';

        // TODO: Get postId from some piece of this page
        var url = document.URL;
        var id = (url).split('=')[1];
        this.props.onCommentSubmit({'postId' : id, 'q1' : q1Result, 'q2' : q2Result })

        // Clear form
        this.refs.q1no.getDOMNode().checked = false;
        this.refs.q1yes.getDOMNode().checked = false;
        this.refs.q2no.getDOMNode().checked = false;
        this.refs.q2yes.getDOMNode().checked = false;
        window.location.href = "/";

        console.log('form submitted sucessfully');
        return;


    },
    render: function() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
            {/*<input type="radio" placeholder="Your name" ref="author" /> */}
            <p> Is there any cyberaggressive behavior in the online posts? Mark yes if there is at least one negative word/comment and or content with intent to harm someone or others.
                </p>
            <input type="radio" name="q1" value="no" ref="q1no" />
            <label>No</label>
            <br />
            <input type="radio" name="q1" value="yes" ref="q1yes" />
            <label>Yes</label>

            <br />

            <p> Is there any cyerbullying in the online post? Mark yes if there are negative words and or comment with intent to harm someone or other, and the posts include two or more repeated negativity against a victim that cannot easily defend him or herself
                </p>
            <input type="radio" name="q2" value="no" ref="q2no" />
            <label>No</label>
            <br />
            <input type="radio" name="q2" value="yes" ref="q2yes" />
            <label>Yes</label>

            <br />

            <input type="submit" value="Submit" />
            </form>
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
        <DawsCommentBox url="cyberbullying.json" pollInterval={2000} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

React.render(
      <CommentBox url="comments.json" pollInterval={2000} />,

  document.getElementById('content')
)

