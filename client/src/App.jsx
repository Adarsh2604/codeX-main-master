import React, { Component, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./app.css";
import { connect } from "react-redux";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse">Loading...</div>
  </div>
);

// Containers
const DefaultLayout = React.lazy(() => import("./layout/defaultLayout"));

// Pages
const Login = React.lazy(() => import("./pages/login/Login"));
const Register = React.lazy(() => import("./pages/register/Register"));
const Page404 = React.lazy(() => import("./pages/page404/Page404"));
const Page500 = React.lazy(() => import("./pages/page500/Page500"));
const HomePage = React.lazy(() => import("./pages/homepage/Homepage"));
function App(props) {
  console.log(props?.uservalue);
  return (
    <Router>
      <Suspense fallback={loading}>
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route
            exact
            path="/register"
            name="Register Page"
            element={<Register />}
          />
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />

          <Route
            path="*"
            name="Home"
            element={<DefaultLayout children={<HomePage />}></DefaultLayout>}
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

const mapStateToProps = (state) => ({
  uservalue: state.uservalue,
  token: state.token,
});

export default connect(mapStateToProps)(App);
