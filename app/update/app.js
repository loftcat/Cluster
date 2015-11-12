/**
 * Created by hebin on 2015/7/24.
 */
var search = require("./search");
var http = require("http");
var cheerio = require("cheerio");
var ClubDao = require("./club");
var PlayerDao = require("./player");


var upsertClubs = function (clubs, league_type, league) {
    for (var i = 0; i < clubs.length; i++) {
        var options = {
            hostname: "baike.baidu.com",
            method: "GET",
            port: 80,
            path: encodeURI("/search/word?word=" + clubs[i] + "足球俱乐部")
        }
        search.searchFlowers(http, options, function (data) {
            var $ = cheerio.load(data);
            $('sup').remove();
            var clubDao = new ClubDao();
            clubDao.add(($('h1.lemmaTitle').text() == "") ? $('span.lemmaTitleH1').text() : $('h1.lemmaTitle').text(),
                ($('div.pic>a').find("img").attr("src") == "") ? $('div.lemma-picture.summary-pic>a').find("img").attr("src") : $('div.pic>a').find("img").attr("src"),
                ($('dd.desc>div.para').text() == "") ? $('div.para').text() : $('dd.desc>div.para').text(), league_type, league, function (e, count) {
                    if (e) {
                        console.log(e);
                    }
                });
        });
    }
}

var count = 0;
var imax_2 = 200000;

var i = 0;


var upsertPlayers = function () {

    console.log("i:" + i);

    var options = {
        hostname: "http://match.sports.sina.com.cn/",
        method: "GET",
        port: 80,
        path: encodeURI("/football/team.php?id=" + i)
    }

    search.searchPlayers(http, options, function (data) {

        var $ = cheerio.load(data);
        var playerDao = new PlayerDao();
        var ch_name = strWithoutNUll(($('strong.fontH.f20').text()), "未知");
        var en_name = strWithoutNUll($('cite.color666').text(), "未知");
        var head = strWithoutNUll($('div.intro-side.player-side').find('img').attr('src'), '');
        var path = options.path;
        var info = '';
        var honor = '';
        var num = '';
        var nationality = '';
        var weight = '';
        var height = '';
        var birthday = '';
        var position = '';
        var club = '';
        var age = 0;

        $('p.intro-con-p').each(function (i, elem) {
            if ($(this).text().indexOf("个人简介") >= 0) {
                $(this).find('span').remove();
                info = $(this).text();
            } else if ($(this).text().indexOf("主要奖项") >= 0) {
                honor = $(this).find('#more_mess').text();
            }
        });
        $('div.intro-con.player-con').find('tr').each(function (i, elem) {
            $(this).find('td').each(function (j, elem) {
                if ($(this).find('span').text().indexOf("号码") >= 0) {
                    $(this).find('span').remove();
                    num = $(this).text();
                } else if ($(this).find('span').text().indexOf("国籍") >= 0) {
                    $(this).find('span').remove();
                    nationality = $(this).text();
                } else if ($(this).find('span').text().indexOf("体重") >= 0) {
                    $(this).find('span').remove();
                    weight = $(this).text();
                } else if ($(this).find('span').text().indexOf("生日") >= 0) {
                    $(this).find('span').remove();
                    birthday = $(this).text();
                } else if ($(this).find('span').text().indexOf("身高") >= 0) {
                    $(this).find('span').remove();
                    height = $(this).text();
                } else if ($(this).find('span').text().indexOf("位置") >= 0) {
                    $(this).find('span').remove();
                    position = $(this).text();
                } else if ($(this).find('span').text().indexOf("年龄") >= 0) {
                    $(this).find('span').remove();
                    age = $(this).text();
                } else if ($(this).find('span').text().indexOf("现效力俱乐部") >= 0) {
                    $(this).find('span').remove();
                    club = $(this).text();
                }
            });
        });

        playerDao.add(ch_name, en_name, info, honor, num, nationality, weight,
            height, birthday, position, club, age, head, path,
            function (e, count) {
                if (e) {
                    console.log(e);
                }
            });

    });

    if (i <= imax_1) {
        if (j < imax_2) {
            j++
        } else {
            i++;
            j = 2000;
        }
    } else {
        process.exit(0);
    }
}


var testPlayers = function () {
    var imax_1 = 20;
    var imax_2 = 3000;
//    for(var i = 0;i<imax_1;i++){
//        for(var j = 0;j<imax_2;j++){
    var options = {
        hostname: "sports.qq.com",
        method: "GET",
        port: 80,
        path: encodeURI("/d/f_players/" + 3 + "/" + 2904 + "/")
    }
    search.searchPlayers(http, options, function (data) {
        var $ = cheerio.load(data);

        var ch_name = strWithoutNUll(($('strong.fontH.f20').text()), "未知");
        var en_name = strWithoutNUll($('cite.color666').text(), "未知");
        var info = '';
        var honor = '';
        var num = '';
        var nationality = '';
        var weight = '';
        var height = '';
        var birthday = '';
        var position = '';
        var club = '';
        var age = 0;

        $('p.intro-con-p').each(function (i, elem) {
            if ($(this).text().indexOf("个人简介") >= 0) {
                $(this).find('span').remove();
                info = $(this).text();
            } else if ($(this).text().indexOf("主要奖项") >= 0) {
                $(this).find('span').remove();
                honor = $(this).text();
            }

        });
        $('div.intro-con.player-con').find('tr').each(function (i, elem) {
            $(this).find('td').each(function (j, elem) {
                if ($(this).find('span').text().indexOf("号码") >= 0) {
                    $(this).find('span').remove();
                    num = $(this).text();
                } else if ($(this).find('span').text().indexOf("国籍") >= 0) {
                    $(this).find('span').remove();
                    nationality = $(this).text();
                } else if ($(this).find('span').text().indexOf("体重") >= 0) {
                    $(this).find('span').remove();
                    weight = $(this).text();
                } else if ($(this).find('span').text().indexOf("生日") >= 0) {
                    $(this).find('span').remove();
                    birthday = $(this).text();
                } else if ($(this).find('span').text().indexOf("身高") >= 0) {
                    $(this).find('span').remove();
                    height = $(this).text();
                } else if ($(this).find('span').text().indexOf("位置") >= 0) {
                    $(this).find('span').remove();
                    position = $(this).text();
                } else if ($(this).find('span').text().indexOf("年龄") >= 0) {
                    $(this).find('span').remove();
                    age = $(this).text();
                } else if ($(this).find('span').text().indexOf("现效力俱乐部") >= 0) {
                    $(this).find('span').remove();
                    club = $(this).text();
                }
            });
        });

        console.log(ch_name);
        console.log(en_name);
        console.log(info);
        console.log(honor);
        console.log(num);
        console.log(nationality);
        console.log(weight);
        console.log(height);
        console.log(birthday);
        console.log(position);
        console.log(club);
        console.log(age);

    });


//        }
//    }
}


var strWithoutNUll = function (str, normal) {
    if (str === null) {
        return normal;
    }
    return str == "" ? normal : str;
}


/*
 * 获取意大利甲级联赛球队基本信息
 * */
var getItalia = function () {
    var italia = ["尤文图斯", "ac米兰", "国际米兰", "罗马", "佛罗伦萨", "桑普多利亚", "乌迪内斯", "拉齐奥", "那不勒斯", "帕尔马", "博洛尼亚",
        "切沃维罗纳", "卡塔尼亚", "亚特兰大", "锡耶纳", "卡利亚里", "巴勒莫", "热那亚", "佩斯卡拉", "都灵"];
    upsertClubs(italia, 3, "意大利足球甲级联赛");
}
/*
 * 获取英格兰超级联赛球队基本信息
 * */
var getEngland = function () {
    var england = ["曼彻斯特联", "曼彻斯特城", "切尔西", "阿森纳", "托特纳姆热刺", "利物浦", "埃弗顿", "南安普顿", "纽卡斯尔", "斯托克城",
        "西汉姆联", "胡尔城", "阿斯顿维拉", "斯旺西", "西布罗姆维奇", "皇家巡游者", "桑德兰", "水晶宫", "莱斯特", "伯恩利"];
    upsertClubs(england, 2, "英格兰足球超级联赛");
}
/*
 * 获取德国足球甲级联赛球队基本信息
 * */
var getGermany = function () {
    var germany = ["拜仁慕尼黑", "多特蒙德", "沙尔克04", "勒沃库森", "沃尔夫斯堡", "门兴格拉德巴赫", "美因茨", "奥格斯堡", "霍芬海姆",
        "汉诺威96", "柏林赫塔", "云达不来梅", "法兰克福", "弗赖堡", "斯图加特", "汉堡", "纽伦堡", "不伦瑞克"];
    upsertClubs(germany, 4, "德国足球甲级联赛");
}
/*
 * 获取西班牙足球甲级联赛球队基本信息
 * */
var getSpain = function () {
    var spain = ["皇家马德里", "巴塞罗那", "马德里竞技", "瓦伦西亚", "塞维利亚", "维戈塞尔塔", "格拉纳达", "皇家社会", "比利亚雷亚尔",
        "拉科鲁尼亚", "皇家贝蒂斯", "马拉加", "毕尔巴鄂竞技", "埃瓦尔", "赫塔菲", "巴列卡诺", "拉斯帕尔马斯", "希洪竞技", "西班牙人", "莱万特"];
    upsertClubs(spain, 1, "西班牙足球甲级联赛");
}

/*
 * 获取西班牙足球甲级联赛球队基本信息
 * */
var getFrance = function () {
    var france = ["巴黎圣日耳曼", "巴斯蒂亚", "昂热", "南特", "雷恩", "兰斯", "卡昂", "摩纳哥", "尼斯",
        "圣埃蒂安", "图卢兹", "里昂", "马赛", "波尔多", "洛里昂", "里尔", "特鲁瓦", "阿雅克肖", "蒙彼利埃", "甘冈"];
    upsertClubs(france, 5, "法国足球甲级联赛");
}

var showAllClubs = function () {
    var clubDao = new ClubDao();
    clubDao.findAll(function (e) {
        if (e) {
            console.log(e);
        }
    })
}


//getItalia();
//getEngland();
//getGermany();
//getSpain();
//getFrance();
//showAllClubs();

//upsertPlayers();

//setInterval(upsertPlayers, 500);
//testPlayers();



