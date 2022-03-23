const fs = require('fs');
const os = require('os'); // platform check
const { exec } = require('child_process');
const packageJSON = require('./package.json');
const projectVersion = packageJSON.version;

var python_alias = "python";
if (os.platform() == "linux"){
    python_alias = "python3";
}
exec(python_alias+" -m pip install phase=="+projectVersion, (error, stdout, stderr) => {
    if (error) {console.log(`error: ${error.message}`); process.exit(1);}
    if (stderr) {console.log(`stderr: ${stderr}`); process.exit(1);}
    console.log(`installed phase python package for interface to phase: ${stdout}`);
});