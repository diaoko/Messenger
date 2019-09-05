var express = require('express');
var router = express.Router();
var myFile = require('../models/file');
const auth = require('../middleware/auth');
/**
 *
 * EndPoint = v1/getFileById/{id}
 * Method = GET
 *
 * Description : this endpoint get id of file and return stream file for client to download
 *  example : v1/getFileById/5d6b6d118446212a783d6393
 *
 */
router.get('/v1/getFileById/:id',auth,function (req,res,next) {
    if(req.params.id==null)
        res.json({haserror:true,code:404,msg: 'file not found'});
    else
    {
        myFile.findOne({_id : req.params.id}).exec(function (err,file) {
            if(file)
                res.download(file.path);
            else
                res.json({haserror:true,code:404,msg: 'file not found'});
        });
    }

});
module.exports = router;