var React = require("react");
var ReactDOM = require("react-dom");
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

var Main = require("./components/Main");

ReactDOM.render(<Main />, document.getElementById("app"));
