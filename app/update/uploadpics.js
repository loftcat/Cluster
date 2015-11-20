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

var BUCKETNAME='fwimg';



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

function uploadBuf(body, key, uptoken,func) {
    var extra = new qiniu.io.PutExtra();
    //extra.params = params;
    //extra.mimeType = mimeType;
    //extra.crc32 = crc32;
    //extra.checkCrc = checkCrc;

    qiniu.io.put(uptoken, key, body, extra, function(err, ret) {
        if (!err) {
            // 上传成功， 处理返回值
            console.log(ret.key, ret.hash);
            func(err,ret);
            // ret.key & ret.hash
        } else {
            // 上传失败， 处理返回代码
            console.log(err);
            func(1);
            // http://developer.qiniu.com/docs/v6/api/reference/codes.html
        }
    });
}


var each = 1;
var total = 0;

var readPic_url = function (pre) {
    console.log(pre);
    var flowerDao = new FlowerDao();
    flowerDao.findNext(pre, each, function (err, docs) {
        if (err) {
            console.error(err);
            if (pre < total - 1) {
                console.log("1");
                readPic_url(++pre)
            }else{
                process.exit(0);
            }
        } else {
            if (docs.length > 0) {
                if (docs[0].head_from != null) {
                    download(80,pre,docs[0], function(err, res) {
                      if(err){
                          if (pre < total - 1) {
                              console.log("2");
                              readPic_url(++pre)
                          }else{
                              process.exit(0);
                          }
                      }
                    });
                }else{
                    if (pre < total - 1) {
                        console.log("3");
                        readPic_url(++pre)
                    }else{
                        process.exit(0);
                    }
                }
            }else{
                if (pre < total - 1) {
                    console.log("4");
                    readPic_url(++pre)
                }else{
                    process.exit(0);
                }
            }
        }

    });
}


var readcount = function () {
    var flowerDao = new FlowerDao();
    flowerDao.count(function (err, count) {
        total = count;
        readPic_url(0);
    });
}





function download(port,pre,item, callback) {

    var urlinfo = urlparse(item.head_from);
    var options = {
        port: port,
        method: 'GET',
        host: urlinfo.hostname,
        path: urlinfo.pathname
    };
    if(urlinfo.search) {
        options.path += urlinfo.search;
    }
    console.log(options.path);
    console.log(options.host);



    var req = http.request(options, function(res) {
        if(res.statusCode==200){
            var bufs= [];
            res.on("data", function (chunk) {
                bufs.push(chunk);
            });

            res.on("end", function () {
                var buf = Buffer.concat(bufs);
                uploadBuf(buf, Date.now()+".jpg", uptoken(BUCKETNAME), function (err,ret) {
                    console.log(ret);
                    if(err) {
                        if (pre < total - 1) {
                            console.log("5");
                            readPic_url(++pre)
                        } else {
                            process.exit(0);
                        }
                    }else{
                        var flowerDao = new FlowerDao();
                        flowerDao.updatePic(item._id,ret.key, function (err,data) {
                                if (pre < total - 1) {
                                    console.log("6");
                                    readPic_url(++pre)
                                } else {
                                    process.exit(0);
                                }
                        })
                    }
                });
            });

        }
        else if(res.statusCode==301||res.statusCode==302){
            if(port!=8080) {
                console.log(res.statusCode + "  " + item.head_from + "  " + res.headers["location"]);
                download(8080, pre, item, function (err, res) {
                    if (err) {
                        if (pre < total - 1) {
                            console.log("2");
                            readPic_url(++pre)
                        } else {
                            process.exit(0);
                        }
                    }
                });
            }else{
                if(callback){
                    callback(1)
                }
            }
        }else{
            console.log(res.statusCode);
            if(callback){
                callback(1)
            }
        }
    });
    req.end();
};

//readcount();


function testdownload(port,url, callback) {

    var urlinfo = urlparse(url);
    var options = {
        port: port,
        method: 'GET',
        host: urlinfo.hostname,
        path: urlinfo.pathname
    };
    if(urlinfo.search) {
        options.path += urlinfo.search;
    }
    console.log(options.path);
    console.log(options.host);



    var req = http.request(options, function(res) {
        if(res.statusCode==200){
            console.log("200");
            var bufs= [];
            res.on("data", function (chunk) {
                bufs.push(chunk);
            });

            res.on("end", function () {
                var buf = Buffer.concat(bufs);
                uploadBuf(buf, Date.now()+".jpg", uptoken(BUCKETNAME), function (err,ret) {
                    console.log(ret);
                    if(err) {
                            console.log("err");
                    }else{
                        var flowerDao = new FlowerDao();
//                        flowerDao.updatePic(item._id,ret.key, function (err,data) {
//                            console.log("6666");
//
//                        })
                        console.log("6666");
                    }
                });
            });

        }
        else if(res.statusCode==301||res.statusCode==302){
            console.log(res.statusCode + "  " + url + "  " + res.headers["location"]);
            if(port!=8080) {
                testdownload(8080, url, function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                });
            }else{
                if(callback){
                    callback(1)
                }
            }
        }else{
            console.log(res.statusCode);
            if(callback){
                callback(1)
            }
        }
    });
    req.end();
};


testdownload(80,"http://g.hiphotos.baidu.com/baike/w%3D268/sign=55dddadf8f1001e94e3c1309800e7b06/5d6034a85edf8db13d02ef520b23dd54564e74dc.jpg", function (err, res) {
    if (err) {
       console.log(err);
    }else{
        console.log("else");
    }
});


