var React = require("react");
var NavLink = require("./children/NavLink");

var Header = React.createClass({

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
                <li><NavLink to="/" onlyActiveOnIndex>News</NavLink></li>
                <li className="disabled"><NavLink to="/mostcommented">Most Commented</NavLink></li>
                <li className="disabled"><NavLink to="/podcasts">Podcasts</NavLink></li>
                <li><NavLink to="/saved">Saved</NavLink></li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    );
  }
});

module.exports = Header;
