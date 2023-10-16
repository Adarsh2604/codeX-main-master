import React from "react";
import "./functions.scss";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import CodeIcon from "@mui/icons-material/Code";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LockIcon from "@mui/icons-material/Lock";
function Functions() {
  return (
    <div className="func">
      <ul>
        <li>
          <CodeIcon className="icons" /> Problem
        </li>
        <li>
          <LockIcon className="icons" /> Solution
        </li>
        <li>
          <ScheduleIcon className="icons" /> Submissions
        </li>
        <li>
          <CommentOutlinedIcon className="icons" /> Discuss
        </li>
      </ul>
    </div>
  );
}

export default Functions;
