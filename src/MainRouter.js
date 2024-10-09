import React from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import AdminLogin from "./Pages/AdminLogin/AdminLogin";
import ControlPanel from "./Pages/ControlPanel/ControlPanel";
import Home from "./Pages/Home/Home";
import PrivateRoute from "./PrivateRoute";

const MainRouter = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={AdminLogin} />
      <PrivateRoute path="/admin" component={ControlPanel} />
      <PrivateRoute path="/assistant" component={ControlPanel} />
      <PrivateRoute path="/doctor" component={ControlPanel} />
      <PrivateRoute path="/receptionist" component={ControlPanel} />
    </Switch>
  </Router>
);

export default MainRouter;
