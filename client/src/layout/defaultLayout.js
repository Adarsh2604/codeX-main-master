import React from "react";
import Header from "../components/navbar/Header";
import "./defaultLayout.scss";
const DefaultLayout = ({ children }) => {
  return (
    <div>
      <Header />

      {children}
    </div>
  );
};

export default DefaultLayout;
