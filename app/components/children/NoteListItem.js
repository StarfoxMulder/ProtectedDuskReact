var React = require("react"),

var NoteListItem = React.createClass({

  render: function() {
    return (
      <li className='note'>
        <div className='media noteMedia'>
          <div className='media-body'>
            <p className='noteText'>"+found[i].body+"</p>
          </div>
          <div className='media-right'>
            <button type='button' className='btn btn-danger btn-sm' data-id='"+found[i]._id+"' href='/delete/"+found[i]._id+"'><span className='glyphicon glyphicon-remove' aria-hidden='true'></span>
            </button>
          </div>
        </div>
      </li>
    )
  }
})

module.exports = NoteListItem;
