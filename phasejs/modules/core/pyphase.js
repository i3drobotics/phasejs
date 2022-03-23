let {PythonShell} = require('python-shell')

function getPath(next){
    // get location of phase python package
    PythonShell.runString('import phase; print(phase.__path__[0])', null, function (err, results) {
        // script finished
        if (err) throw err;
        next(err, results[0]);
    });
}

function run(command, next){
    // run python script
    PythonShell.runString(command, null, function (err, results) {
        // script finished
        if (err) throw err;
        //console.log("PythonShell complete");
        next(err, results);
    });
}

// exports
exports.getPath = getPath;
exports.run = run;