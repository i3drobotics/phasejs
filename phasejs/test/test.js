const phase = require("../index.js"); // internal import phase
var assert = require('assert'); // assert used for testing

describe('core', function() {
    describe('stereoprocess', function() {
        describe('testProcessStereo', function() {
            it('process stereo files (timeout extended due to processing time)', function(done) {
                this.timeout(15000); //increase timeout as stereo match may take some time
                var camera_name = "stereotheatresim";
                var cal_type = "ros";
                var resource_folder = "../../../resources";
                var left_yaml = resource_folder+"/test/"+ camera_name +"/"+ cal_type +"/left.yaml";
                var right_yaml = resource_folder + "/test/" + camera_name + "/" + cal_type + "/right.yaml";
                var left_image_file = resource_folder + "/test/" + camera_name + "/left.png";
                var right_image_file = resource_folder + "/test/" + camera_name + "/right.png";
                var rectify = true;
                phase.core.processStereoFiles(0, left_yaml, right_yaml, left_image_file, right_image_file, "../../../out/nodejs", rectify, function(err, ret){
                    console.log(ret);
                    done();
                });
            });
        });
    });
});