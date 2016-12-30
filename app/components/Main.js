var React = require("react"),
    Results = require("./children/Results"),
    Form = require("./children/Form"),
    Saved = require("./children.Saved"),
    helper = require("./utils/helper.js");

var Main = React.createClass({
  getInitialState: function() {
    return {
      results: [],
      saved: [],
      notes: []
    }
  },

  componentDidMount: function() {
    // helper.getSaved().then(function (saved) {
    //   if (!isEqual(saved, this.state.saved)) {
    //     this.setState({saved: saved.data});
    //   }
    // }.bind(this));
  },

  componentDidUpdate: function() {

  },

  setSaved: function() {
    // May not use since this will render the article on this page by updating its state
  },

  saveNote: function() {
    helper.saveNote(newNote).then(function (response) {
          console.log("Note successfully saved: ", response);
      });
  },

  saveArticle: function() {
    helper.saveArticle(newArticle).then(function (response) {
          console.log("Article successfully saved: ", response);
      });
  },

  deleteNote: function() {

  },

  deleteArticle: function() {

  },

  render: function() {
    return (
      <header>
        <nav className="navbar navbar navbar-static-top">
          <div className="container-fluid">
            {/* navbar colapse */}
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" dataToggle="collapse" dataTarget="#bs-example-navbar-collapse-1" ariaExpanded="false">
                 <span className="sr-only">Toggle navigation</span>
                 <span className="icon-bar"></span>
                 <span className="icon-bar"></span>
                 <span className="icon-bar"></span>
              <a className="navbar-brand" href="/" id="brandTitle">Protected Dusk</a>
              </button>
            </div>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <ul className="nav navbar-nav">
                <li><a href="/">News</a></li>
                <li className="disabled"><a href="/mostcommented">Most Commented</a></li>
                <li className="disabled"><a href="/podcasts">Podcasts</a></li>
                <li className="disabled"><a href="/saved" >Saved</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <div className="container">
        <div className="row">

          <Results
          />
          <Form
          />

        </div>
      </div>
    );
  }

});

module.exports = Main;
