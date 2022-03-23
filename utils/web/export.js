const path = require("path");
const fs = require('fs');
const os = require("os");
const formidableMiddleware = require('express-formidable');
const phase = require("@i3dr/phase");

const index_page = path.join(__dirname,'./public/index.html');
const root = path.join(__dirname,'./public');

exports.index_page=index_page;
exports.root=root;

exports.config_app=function(app, subdomain){
    if (subdomain === undefined) {
        subdomain = "";
    }

    // TODO unique folder for data upload (to avoid collision)
    if (!fs.existsSync(path.join(__dirname,'public','images'))){
        fs.mkdirSync(path.join(__dirname,'public','images'));
    }
    if (!fs.existsSync(path.join(__dirname,'public','images','upload'))){
        fs.mkdirSync(path.join(__dirname,'public','images','upload'));
    }

    app.use(formidableMiddleware({
        encoding: 'utf-8',
        uploadDir: path.join(__dirname,'public','images','upload'),
        multiples: false
    }));

    app.get(subdomain+"/result", (req, res) => {
        res.sendFile(path.join(__dirname, "./public/images/disparity_norm.png"));
    });

    app.post('/processStereo', function(req,res) {
        var left_image_old_path = req.files.left_image_upload.path;
        var right_image_old_path = req.files.right_image_upload.path;
        var left_yaml_old_path = req.files.left_yaml_upload.path;
        var right_yaml_old_path = req.files.right_yaml_upload.path;
        // TODO unique folder for data upload (to avoid collision)
        var left_image_new_path = path.join(__dirname, 'public', 'images', 'upload', req.files.left_image_upload.name);
        var right_image_new_path = path.join(__dirname, 'public', 'images', 'upload', req.files.right_image_upload.name);
        var left_yaml_new_path = path.join(__dirname, 'public', 'images', 'upload', req.files.left_yaml_upload.name);
        var right_yaml_new_path = path.join(__dirname, 'public', 'images', 'upload', req.files.right_yaml_upload.name);
        // TODO do this async
        try {
            fs.renameSync(left_image_old_path, left_image_new_path);
            fs.renameSync(right_image_old_path, right_image_new_path);
            fs.renameSync(left_yaml_old_path, left_yaml_new_path);
            fs.renameSync(right_yaml_old_path, right_yaml_new_path);
        } catch (e) {
            console.log(e);
            console.log("failed to load images");
            res.redirect(subdomain);
            return;
        }

        // Call the process function
        var left_yaml = left_yaml_new_path;
        var right_yaml = right_yaml_new_path;
        var left_image_file = left_image_new_path;
        var right_image_file = right_image_new_path;
        var out_folder = path.join(__dirname,'public','images');
        console.log("Starting stereo processing...");
        phase.core.processStereoFiles(
            0, left_yaml, right_yaml, left_image_file, right_image_file, out_folder, true,
            function(err, ret){
                if (err) throw err;
                console.log("stereo match process returned: "+ret);
                if (ret){
                    res.redirect(subdomain+'/result');
                } else {
                    console.log("Failed to process images");
                    res.redirect(subdomain);
                }
            }
        );
    });
};