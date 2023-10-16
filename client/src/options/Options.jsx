import React from "react";
import "./options.scss";

function Options() {
  return (
    <div className="item">
    <select id="lang">
      <option className="ln" value="C++">C++(g++ 5.4)</option>
      <option className="ln" value="C">C</option>
      <option className="ln" value="Python">Pyhton</option>
      <option className="ln" value="Java">Java</option>
      <option className="ln" value="JavaScript">JavaScript</option>
    </select>
    </div>
  );
}

export default Options;
