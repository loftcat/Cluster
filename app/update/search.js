/**
 * Created by hebin on 2015/7/24.
 */
var cheerio = require("cheerio");

var searchFinalFlowers = function (http, options, func) {
    var clientReq = http.request(options, function (res) {
        if (res.statusCode == 302) {
            var options = {
                hostname: "baike.baidu.com",
                method: "GET",
                port: 80,
                path: encodeURI(res.headers["location"])
            }
            searchFlowers(http, options, func);

        } else if (res.statusCode == 200) {

            var data = "";
            res.on("data", function (chunk) {
                data += chunk;
            });
            res.on("end", function () {
                func(0,data);
            });


        }
    });
    clientReq.on('error', function(err) {
        console.log("error")
    });
    clientReq.end();
}

var searchFlowers = function (http, options, func) {
    var clientReq = http.request(options, function (res) {
        console.log(res.statusCode);
        if (res.statusCode == 302||res.statusCode ==301) {
            console.log(res.headers["location"]);
            var options = {
                hostname: "baike.baidu.com",
                method: "GET",
                port: 80,
                path: encodeURI(res.headers["location"])
            }
            searchFlowers(http, options, func);
        } else if (res.statusCode == 200) {
            var data = "";
            res.on("data", function (chunk) {
                data += chunk;
            });
            res.on("end", function () {
                var $ = cheerio.load(data);
                var size =$("ul.polysemantList-wrapper.cmn-clearfix").find('li').length;
                if(size<1){//检查多义项\
                    console.log("1");
                    var size_2 = $("ul.custom_dot.para-list.list-paddingleft-1").find('li').length;
                        if(size_2<1){
                            console.log("2");
                            func(0,data);
                        }else{
                            console.log("3");
                            var title=$("div.main-content.lemmaWgt-subLemmaListTitle").text();
                            if(title!=null&&title.indexOf("多义词")<0){
                                console.log("3");
                                func(0,data);
                            }else{
                                console.log("4");
                                $("div.custom_dot.para-list.list-paddingleft-1").find('li').each(function (i, elem) {
                                var title =$(this).find('a').text();
                                if(title!=null&&(title.indexOf("植物") >= 0||title.indexOf("花卉") >= 0||title.indexOf("草本") >= 0||title.indexOf("龙舌兰") >= 0))
                                {
                                    var options = {
                                        hostname: "baike.baidu.com",
                                        method: "GET",
                                        port: 80,
                                        path: encodeURI($(this).find('a').attr('href'))
                                    }
                                    searchFinalFlowers(http, options, func);
                                    return ;
                                }
                            });
                        }
                        }
                }else{
                    var done= false;
                    $("ul.polysemantList-wrapper.cmn-clearfix").find('li').each(function (i, elem) {

                            var title =$(this).find('a').attr('title');
                            var selected = $(this).find('span').text();


                            if(title!=null&&(title.indexOf("植物") >= 0||title.indexOf("花卉") >= 0||title.indexOf("草本") >= 0||title.indexOf("龙舌兰") >= 0))
                        {
                            var options = {
                                hostname: "baike.baidu.com",
                                method: "GET",
                                port: 80,
                                path: encodeURI($(this).find('a').attr('href'))
                            }
                            done=true;
                            searchFinalFlowers(http, options, func);
                            return false;
                        }else if(selected!=null&&(selected.indexOf("植物")>=0||selected.indexOf("花卉")>=0||selected.indexOf("草本") >= 0||selected.indexOf("龙舌兰") >= 0)) {
                                var options = {
                                    hostname: "baike.baidu.com",
                                    method: "GET",
                                    port: 80,
                                    path: encodeURI(res.req.path)
                                }
                                done=true;
                                searchFinalFlowers(http, options, func);
                                return false;
                            }
                    }
                    );

                    if(!done){
                        func(0,data)
                    }


                }
            });
        }else{
            func(1,data)
        }
    });
    clientReq.on(1, function(err) {
        console.log("error")
    });
    clientReq.end();
}


exports.searchFlowers = searchFlowers;
