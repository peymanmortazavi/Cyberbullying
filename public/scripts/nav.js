var NavBar = React.createClass({
  render: function() {
    return (
      <div className="navBar">
        <h3>
        <b>
            Cyberbullying
        </b>
        | <a href="/">Home</a>
        | <a href="/form.html?id=0">Form</a>
        | <a href="/results.html">Results</a>
        </h3>

      </div>
    );
  }
});

React.render(
      <NavBar />, document.getElementById('navbar')
)

