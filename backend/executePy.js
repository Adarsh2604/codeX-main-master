const { exec } = require("child_process");

const executePy = (filepath) => {
  const temp = filepath.split("\\");
  const jobId = temp[temp.length-1];
  return new Promise((resolve, reject) => {
    exec(
      `cd codes && python ${jobId}`,
      (error, stdout, stderr) => {
        error && reject({ error, stderr });
        stderr && reject(stderr);
        resolve(stdout);
      }
    );
  });
};

module.exports = {
  executePy,
};
