const os = require("os");
const pyphase = require('./pyphase.js');

function processStereoFiles(stereo_matcher_type, left_yaml, right_yaml, left_image_path, right_image_path, output_folder, rectify, next){
    //TODO async this
    var stereo_matcher_type_enum = "";
    if (stereo_matcher_type === 0){
        stereo_matcher_type_enum = "StereoMatcherType.STEREO_MATCHER_BM";
    } else {
        console.log("unsupported stereo matcher type: "+stereo_matcher_type);
        return false;
    }
    py_imports = "from phase.core.types import StereoMatcherType; from phase.core import processStereoFiles;";
    
    if (rectify){
        py_bRectify = "True";
    } else {
        py_bRectify = "False";
    }

    if (os.platform() == "win32"){
        py_command_args = stereo_matcher_type_enum+",r'"+left_yaml+"',r'"+right_yaml+"',r'"+left_image_path+"',r'"+right_image_path+"',r'"+output_folder+"',"+py_bRectify+"";
    } else {
        py_command_args = stereo_matcher_type_enum+",'"+left_yaml+"','"+right_yaml+"','"+left_image_path+"','"+right_image_path+"','"+output_folder+"',"+py_bRectify+"";
    }
    py_command = "success = processStereoFiles("+py_command_args+"); print(success);";
    //console.log(py_imports + py_command);
    pyphase.run(py_imports + py_command, function(err, res){
        if (err) throw err;
        // get last print statement
        success = res[res.length - 1];
        if (os.platform() === "win32"){
            success_split = success.split('\n');
            success = success_split[success_split.length - 1];
        }
        console.log(success);
        if (success === "True"){
            next(err, true);
            return true;
        } else {
            console.log(res);
            next(err, false);
            return false;
        }
    });
};

// exports
exports.processStereoFiles = processStereoFiles;

// TODO find way to use ffi-napi for native C++ calls
// couldn't find a way to package npm when needing library files from
// all platforms. 

/*
const ffi = require("ffi-napi"); // create js bindings from C++
const os = require('os'); // platform check
// define full path to Phase core library
var libName = "";
if (os.platform() == "win32"){
    libName = 'i3dr-phase_core';
} else {
    libName = 'libi3dr-phase_core';
}
var libPath = path.join(__dirname, '..' , '..', 'externals');
var libFullName = path.join(libPath, libName);

// define format for library functions
var libFuncs = {
    "I3DR_ProcessStereoFiles": [
        "bool", ["int", "string", "string", "string", "string", "string"]
    ]
}

// load library functions
var lib = ffi.Library(libFullName, libFuncs);

// js wrapper for functions
function processStereoFiles(stereo_matcher_type, left_yaml, right_yaml, left_image_path, right_image_path, output_folder){
    return lib.I3DR_ProcessStereoFiles(stereo_matcher_type, left_yaml, right_yaml, left_image_path, right_image_path, output_folder);
};
*/