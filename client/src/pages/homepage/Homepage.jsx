import "./homepage.scss";
import CodeMirror from "@uiw/react-codemirror";
import { dracula } from "@uiw/codemirror-theme-dracula";
import Functions from "../../functions/Functions";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import moment from "moment";
import stubs from "./stubs";
function Homepage() {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    setCode(stubs[language]);
  }, [language]);

  useEffect(() => {
    const defaultLang = localStorage.getItem("default-language") || "cpp";
    setLanguage(defaultLang);
  }, []);

  let pollInterval;

  const handleSubmit = async () => {
    const payload = {
      language,
      code,
    };
    try {
      setOutput("");
      setStatus(null);
      setJobId(null);
      setJobDetails(null);
      const { data } = await axios.post("http://localhost:5000/run", payload);
      if (data.jobId) {
        setJobId(data.jobId);
        setStatus("Submitted.");

        // poll here
        pollInterval = setInterval(async () => {
          const { data: statusRes } = await axios.get(
            `http://localhost:5000/status`,
            {
              params: {
                id: data.jobId,
              },
            }
          );
          const { success, job, error } = statusRes;
          console.log(statusRes);
          if (success) {
            const { status: jobStatus, output: jobOutput } = job;
            setStatus(jobStatus);
            setJobDetails(job);
            if (jobStatus === "pending") return;
            setOutput(jobOutput);
            clearInterval(pollInterval);
          } else {
            console.error(error);
            setOutput(error);
            setStatus("Bad request");
            clearInterval(pollInterval);
          }
        }, 1000);
      } else {
        setOutput("Retry again.");
      }
    } catch ({ response }) {
      if (response) {
        const errMsg = response.data.err.stderr;
        setOutput(errMsg);
      } else {
        setOutput("Please retry submitting.");
      }
    }
  };

  const setDefaultLanguage = () => {
    localStorage.setItem("default-language", language);
    console.log(`${language} set as default!`);
  };

  const renderTimeDetails = () => {
    if (!jobDetails) {
      return "";
    }
    let { submittedAt, startedAt, completedAt } = jobDetails;
    let result = "";
    submittedAt = moment(submittedAt).toString();
    result += `Job Submitted At: ${submittedAt}  `;
    if (!startedAt || !completedAt) return result;
    const start = moment(startedAt);
    const end = moment(completedAt);
    const diff = end.diff(start, "seconds", true);
    result += `Execution Time: ${diff}s`;
    return result;
  };

  return (
    <div className="App">
      <div className="container">
        <div className="wrap">
          <Functions />
          <textarea
            name="quest"
            value={output}
            cols="100"
            rows="10"
            style={{ color: status === "success" ? "green" : "red" }}
            className="left-half"
          ></textarea>
        </div>
        <div className="right-half">
          <select
            value={language}
            onChange={(e) => {
              const shouldSwitch = window.confirm(
                "Are you sure you want to change language? WARNING: Your current code will be lost."
              );
              if (shouldSwitch) {
                setLanguage(e.target.value);
              }
            }}
          >
            <option value="cpp">C++</option>
            <option value="py">Python</option>
          </select>
          <CodeMirror
            className="ide"
            value={code}
            height="78vh"
            width="100%"
            theme={dracula}
            keymap="sublime"
            mode="python"
            onChange={(value) => setCode(value)}
          />
          <div className="btn">
            <button id="item0">Custom Input</button>
            <button id="item1">Run Code</button>
            <button id="item2" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
