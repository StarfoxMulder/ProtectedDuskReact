var React = require("react"),
    Header = require("./children/Header"),
    Results = require("./children/Results"),
    Form = require("./children/Form"),
    Saved = require("./children.Saved"),
    isEqual = require("lodash.isequal"),
    helper = require("./utils/helper.js");

var Main = React.createClass({

  getInitialState: function() {
    return {
      noteBody: "",
      results: [],
      saved: [],
      notes: []
    }
  },

  componentDidMount: function() {
    helper.getSaved().then(function (saved) {
      if (!isEqual(saved, this.state.saved)) {
        this.setState({saved: saved.data});
      }
    }.bind(this));
  },

  componentDidUpdate: function() {
    helper.runQuery(this.state).then(function (results) {
      if (!isEqual(results, this.state.results)) {
        this.setState({results: results});
        return;
      }
    }.bind(this));
  },

  loadArticles: function() {
    helper.getArticles()
    .then(function (results) {

    })
  },

  saveNote: function(newNote) {
    console.log("start saveNote with newNote ", newNote);
    helper.saveNote(newNote).then(function (response) {
      console.log("Note successfully saved: ", response);
    });
  },

  deleteNote: function(id) {
    console.log("start deleteNote with id of ", id);
    helper.deleteNote(id).then(function (response) {
      console.log("Note successfully deleted: ", response);
    });
  },

  saveArticle: function(newArticle) {
    console.log("start saveArticle with newArticle ", newArticle);
    helper.saveArticle(newArticle).then(function (response) {
        console.log("Article successfully saved: ", response);
    });
  },

  removeArticle: function(id) {
    console.log("start removeArticle with id of ", id);
    helper.deleteNote(id).then(function (response) {
      console.log("Note successfully deleted: ", response);
    });
  },

  // setSaved: function(saved) {
  //   this.state.saved.push(saved);
  // },


  render: function() {
    return (

      <div className="container">
        <div className="row">
          <Header />
        </div>
        <div className="row">
          <Results />
      {/* React Key Property
      How to utilize key for iterating through ajax responses to
      populate Note and Article elements/components as such:
      <li key={found._id}> </li> ((key={found[i]._id}??))
      */}
          <Form />
        </div>
      </div>
    );
  }

});

module.exports = Main;

{/*
  From React Documentation
  https://facebook.github.io/react/tutorial/tutorial.html
When a list is rerendered, React takes each element in the new version and looks for one with a matching key in the previous list. When a key is added to the set, a component is created; when a key is removed, a component is destroyed. Keys tell React about the identity of each component, so that it can maintain the state across rerenders. If you change the key of a component, it will be completely destroyed and recreated with a new state.

Component keys don't need to be globally unique, only unique relative to the immediate siblings.

*/}
