// import phase
const phase = require("@i3dr/phase");

// Process files
var camera_name = "stereotheatresim";
var cal_type = "ros";
var resource_folder = "../../../resources";
var left_yaml = resource_folder+"/test/"+ camera_name +"/"+ cal_type +"/left.yaml";
var right_yaml = resource_folder + "/test/" + camera_name + "/" + cal_type + "/right.yaml";
var left_image_file = resource_folder + "/test/" + camera_name + "/left.png";
var right_image_file = resource_folder + "/test/" + camera_name + "/right.png";
phase.core.processStereoFiles(0, left_yaml, right_yaml, left_image_file, right_image_file, "../../../out/nodejs", true, function(err, ret){
    if (err) throw err;
    console.log(ret);
});