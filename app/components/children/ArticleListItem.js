var React = require("react"),

var ArticleListItem = React.createClass({

  render: function() {
    return (
      <li>
        <div className='media'>
          <div className='media-left'>
            <img className='media-object' src='{{this.props.image}}'>
          </div>
          <div className='media-body'>
            <a href='{{this.props.link}}'>
            <h4 className='media-heading'>{{this.props.title}}</h4>
            </a>{{this.props.source}}
          </div>
          <div className='media-right'>
            <form>
              <button type='submit' className='btn btn-info noteBtn' data-id='{{this.props._id}}' href='/{{this.props._id}}'>
              <span className='glyphicon glyphicon-comment' aria-hidden='true'></span> Note
              </button>
              <button type='submit' className='btn btn-warning disabled' data-id='{{this.props._id}}' href='/save/{{this.props._id}}'>
              <span className='glyphicon glyphicon-pushpin' aria-hidden='true'></span> Save
              </button>
            </form>
          </div>
        </div>
      </li>
    )
  }
})

module.exports = ArticleListItem;
