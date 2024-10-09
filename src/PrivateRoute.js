import React, { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { UserContext } from "./App";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [loggedInUser] = useContext(UserContext);
  const sessionUser = sessionStorage.getItem("user");

  console.log("loggedInUser:", loggedInUser); // Debugging
  console.log("sessionUser:", sessionUser); // Debugging

  return (
    <Route
      {...rest}
      render={(props) =>
        loggedInUser.email || sessionUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
