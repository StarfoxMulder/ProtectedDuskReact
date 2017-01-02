var React = require("react");
import { Link } from 'react-router'

var Header = React.createClass({
  render: function() {
    return (
      <Link {...this.props} activeClassName="activeNavLink" />
    )
  }
});

module.exports = NavLink;
