/**
 * Created by hebin on 2015/11/16.
 * 将图片下载发送至七牛云存储，并更改数据库;
 */


var FlowerDao = require("../models/flower");
var urlparse = require('url').parse;
var http = require('http')
var fs = require('fs');
var qiniu = require('qiniu');

qiniu.conf.ACCESS_KEY = 'omw-A-j7ncLvndxamWR-9hGzCnJeydBj_cSe04jd';
qiniu.conf.SECRET_KEY = 'ZMCYXG_VdSTplpZ0pebZQ6SalfRDmgxxcvXlqpgb';

qiniu.conf.ACCESS_KEY = "omw-A-j7ncLvndxamWR-9hGzCnJeydBj_cSe04jd";
qiniu.conf.SECRET_KEY = "ZMCYXG_VdSTplpZ0pebZQ6SalfRDmgxxcvXlqpgb";

var BUCKETNAME='player-head';



function uptoken(bucketname) {
    var putPolicy = new qiniu.rs.PutPolicy(bucketname);
    //putPolicy.callbackUrl = callbackUrl;
    //putPolicy.callbackBody = callbackBody;
    //putPolicy.returnUrl = returnUrl;
    //putPolicy.returnBody = returnBody;
    //putPolicy.asyncOps = asyncOps;
    //putPolicy.expires = expires;
    return putPolicy.token();
}

function uploadBuf(body, key, uptoken) {
    var extra = new qiniu.io.PutExtra();
    //extra.params = params;
    //extra.mimeType = mimeType;
    //extra.crc32 = crc32;
    //extra.checkCrc = checkCrc;

    qiniu.io.put(uptoken, key, body, extra, function(err, ret) {
        if (!err) {
            // 上传成功， 处理返回值
            console.log(ret.key, ret.hash);
            // ret.key & ret.hash
        } else {
            // 上传失败， 处理返回代码
            console.log(err)
            // http://developer.qiniu.com/docs/v6/api/reference/codes.html
        }
    });
}







var each = 1;
var total = 0;

var readPic_url = function (pre) {
    var flowerDao = new FlowerDao();
    flowerDao.findNext(pre, each, function (err, docs) {
        if (err) {
            console.error(err);
            if (pre < total - 1) {
                readPic_url(pre++)
            }else{
                process.exit(0);
            }
        } else {
            if (docs.length > 0) {
                if (docs[0].head_from != null) {
                    console.log(docs[0].head_from);
                    download(docs[0].head_from, "E:webspace/Cluster/app/update/test.jpg", function(err, res) {
                        if(res.statusCode==200){
                            uploadBuf
                        }
                        //if (pre < total - 1) {
                        //    readPic_url(pre++)
                        //}else{
                        //    process.exit(0);
                        //}
                    });
                }else{
                    if (pre < total - 1) {
                        readPic_url(pre++)
                    }else{
                        process.exit(0);
                    }
                }
            }else{
                if (pre < total - 1) {
                    readPic_url(pre++)
                }else{
                    process.exit(0);
                }
            }
        }

    });
}


var readcount = function () {
    //var flowerDao = new FlowerDao();
    //flowerDao.count(function (err, count) {
    //    total = count;
    //    readPic_url();
    //});
    total = 1;
    readPic_url(0);
}


readcount();



function download(url, savefile, callback) {
    console.log('download', url, 'to', savefile)
    var urlinfo = urlparse(url);
    var options = {
        method: 'GET',
        host: urlinfo.hostname,
        path: urlinfo.pathname
    };
    if(urlinfo.port) {
        options.port = urlinfo.port;
    }
    if(urlinfo.search) {
        options.path += urlinfo.search;
    }
    var req = http.request(options, function(res) {
        var writestream = fs.createWriteStream(savefile);
        writestream.on('close', function() {
            callback(null, res);
        });
        res.pipe(writestream);

    });
    req.end();
};







