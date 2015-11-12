/**
 * Created by hebin on 2015/11/6.
 */


var search = require("./search");
var http = require("http");
var cheerio = require("cheerio");
var FlowerDao = require("../models/flower");
var utils = require("../tools/utils");
var succulent_plants = [
    "虎刺梅"
    , "雷神"
    , "金手指"
    , "仙人掌"
    , "昙花"
    , "仙人球"
    , "生石花"
    , "宝石花"
    , "蟹爪兰"
    , "虹之玉"
    , "碰碰香"
    , "燕子掌"
    , "熊童子"
    , "黑法师"
    , "雅乐之舞"
    , "金琥"
    , "玉扇"
    , "火祭"
    , "星美人"
    , "子持莲华"
    , "黄丽"
    , "令箭荷花"
    , "玉蝶"
    , "桃美人"
    , "佛甲草"
    , "八宝景天"
    , "垂盆草"
    , "鹿角海棠"
    , "不夜城芦荟"
    , "珍珠吊兰"
    , "麒麟掌"
    , "八千代"
    , "碧光环"
    , "姬星美人"
    , "宝草"
    , "乙女心"
    , "假昙花"
    , "吉娃莲"
    , "紫珍珠"
    , "姬玉露"
    , "冬美人"
    , "量天尺"
    , "锦晃星"
    , "蓝石莲"
    , "千佛手"
    , "小球玫瑰"
    , "薄雪万年草"
    , "姬胧月"
    , "筒叶花月"
    , "条纹十二卷"
    , "五十铃玉"
    , "绯花玉"
    , "大和锦"
    , "玉吊钟"
    , "虹之玉锦"
    , "子宝"
    , "金边龙舌兰"
    , "姬秋丽"
    , "玉翁"
    , "月兔耳"
    , "金虎仙人球"
    , "龙骨柱"
    , "茜之塔"
    , "山影拳"
    , "特玉莲"
    , "霜之朝"
    , "短叶虎尾兰"
    , "爱之蔓"
    , "仙人柱"
    , "乌羽玉"
    , "青星美人"
    , "红稚莲"
    , "球松"
    , "枝干番杏"
    , "马齿苋树"
    , "小人祭"
    , "金钱木"
    , "雷童"
    , "莲花掌"
    , "秋丽"
    , "丽娜莲"
    , "多肉观音莲"
    , "若歌诗"
    , "铭月"
    , "露娜莲"
    , "芙蓉雪莲"
    , "鸾凤玉"
    , "清盛锦"
    , "草玉露"
    , "白雪姬"
    , "蛛丝卷绢"
    , "玉龙观音"
    , "绯牡丹"
    , "红稚儿"
    , "新玉缀"
    , "姬红小松"
    , "唐印"
    , "白凤菊"
    , "千代田之松"
    , "白花小松"
    , "三角琉璃莲"
    , "大叶落地生根"
    , "仙女杯"
    , "若绿"
    , "凝脂莲"
    , "黄花照波"
    , "鲁氏石莲花"
    , "初恋"
    , "天狗之舞"
    , "玉米石"
    , "魔南景天"
    , "春之奇迹"
    , "吹雪之松锦"
    , "子孙球"
    , "紫弦月"
    , "叶仙人掌"
    , "黄金花月"
    , "四海波"
    , "赤鬼城"
    , "凝脂菊"
    , "静夜"
    , "红缘莲花掌"
    , "绒针"
    , "月宫殿"
    , "红粉台阁"
    , "中华芦荟"
    , "鼠尾掌"
    , "翡翠景天"
    , "布纹球"
    , "高砂之翁"
    , "伽蓝菜"
    , "福娘"
    , "星王子"
    , "小和锦"
    , "星乙女"
    , "千兔耳"
    , "小红衣"
    , "白牡丹"
    , "熊童子白锦"
    , "帝冠"
    , "爱染锦"
    , "雪莲"
    , "快刀乱麻"
    , "樱水晶"
    , "美丽莲"
    , "毛海星"
    , "黄毛掌"
    , "宝绿"
    , "黑王子"
    , "眩美玉"
    , "芳香波"
    , "神想曲"
    , "观音莲"
    , "琉璃殿"
    , "京之华锦"
    , "金晃"
    , "碧玉莲"
    , "黑兔耳"
    , "白凤"
    , " 英冠玉"
    , "小玉"
    , "方鳞绿塔"
    , "雨心"
    , "紫蛮刀"
    , "十字星锦"
    , "兰黛莲"
    , "条纹蛇尾兰"
    , "锦上珠"
    , "白斑玉露"
    , "蝉翼玉露"
    , "大型玉露"
    , "樱麒麟"
    , "花叶寒月夜"
    , "毛叶莲花掌"
    , "朱莲"
    , "红辉艳"
    , "九轮塔"
    , "花月夜"
    , "梨果仙人掌"
    , "松霞"
    , "圆头玉露"
    , "龙须海棠"
    , "胧月"
    , "泥鳅掌"
    , "黑法师原始种"
    , "红彩阁"
    , "黄金钮"
    , "大卫"
    , "塔松"
    , "神童"
    , "青凤凰"
    , "翁柱"
    , "蓝松"
    , "紫牡丹"
    , "明镜"
    , "银星"
    , "瓦松"
    , "金纽仙人鞭"
    , "黄雪光"
    , "彩云球"
    , "白龙球"
    , "四裂红景天"
    , "草芦荟"
    , "旋风麒麟"
    , "仙人镜"
    , "玉牛掌"
    , "中斑莲花掌"
    , "灿烂缀化"
    , "大叶莲花掌"
    , "半岛玉"
    , "奔龙"
    , "千羽鹤"
    , "龙鳞"
    , "卧牛"
    , "玛瑙殿"
];
//var succulent_plants=["雷神"];
var type = "多肉植物";

var index = 0;

var getSucculent_plants = function () {
    upsertFlowers();
}


var upsertFlowers = function () {

    console.time("turn" + index);
    var options = {
        hostname: "baike.baidu.com",
        method: "GET",
        port: 80,
        path: encodeURI("/search/word?word=" + succulent_plants[index])
    }
    search.searchFlowers(http, options, function (e, data) {
        if (!e) {
            var $ = cheerio.load(data);
            var title = [];
            var value = [];
            var flower = {
                basic_info: {}
            };

            $('div.basic-info').find('dl').each(function (i, elem) {
                $(this).find('dt').each(function (i, elem) {
                    title.push(utils.removeAllSpace($(this).text()));
                });
                $(this).find('dd').each(function (i, elem) {
                    value.push(utils.removeAllSpace($(this).text()));
                });
            });
            flower.head_from = utils.strWithoutEmpty($('div.summary-pic').find('img').attr('src'), "暂无");
            flower.type = type;
            flower.desc = utils.strWithoutEmpty(utils.removeAllSpace($('div.lemma-summary').text()), "暂无");
            for (var i = 0; i < title.length; i++) {
                if (title[i] == "中文学名") {
                    flower.basic_info.ch_name = {
                        title: title[i],
                        value: value[i]
                    }
                    flower.name = utils.strWithoutEmpty(value[i]);
                } else if (title[i] == "拉丁学名") {
                    flower.basic_info.scientific_name = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "别称") {
                    flower.basic_info.nick_name = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "界") {
                    flower.basic_info.regnumvegetabile = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "亚界") {
                    flower.basic_info.subkingdom = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "门") {
                    flower.basic_info.divisio = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "亚门") {
                    flower.basic_info.subdivisio = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "纲") {
                    flower.basic_info.classis = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "亚纲") {
                    flower.basic_info.subclassis = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "目") {
                    flower.basic_info.ordo = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "亚目") {
                    flower.basic_info.subordo = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "科") {
                    flower.basic_info.familia = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "亚科") {
                    flower.basic_info.subfamilia = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "族") {
                    flower.basic_info.tribus = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "亚族") {
                    flower.basic_info.subtribus = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "属") {
                    flower.basic_info.genus = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "亚属") {
                    flower.basic_info.subgenus = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "组") {
                    flower.basic_info.sectio = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "亚组") {
                    flower.basic_info.subsectio = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "系") {
                    flower.basic_info.series = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "亚系") {
                    flower.basic_info.subseries = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "种") {
                    flower.basic_info.species = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "亚种") {
                    flower.basic_info.subspecies = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "变种") {
                    flower.basic_info.varietas = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "变型") {
                    flower.basic_info.forma = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "分布区域") {
                    flower.basic_info.area = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "环境分布") {
                    flower.basic_info.enviroment = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "生态习性") {
                    flower.basic_info.ecological_habit = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "生活型") {
                    flower.basic_info.life_form = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "日照") {
                    flower.basic_info.illumination = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "水分") {
                    flower.basic_info.moisture = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "温度") {
                    flower.basic_info.temperature = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "土壤") {
                    flower.basic_info.soil = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "海拔") {
                    flower.basic_info.altitude = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "花期") {
                    flower.basic_info.florescence = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "药用价值") {
                    flower.basic_info.medicinal_value = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "工业价值") {
                    flower.basic_info.industrial_value = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "特殊用途") {
                    flower.basic_info.special_purpose = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "毒性") {
                    flower.basic_info.toxicity = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "象征意义") {
                    flower.basic_info.symbolic_significance = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "原产地") {
                    flower.basic_info.origin = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "原产地") {
                    flower.basic_info.origin = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "二名法") {
                    flower.basic_info.binomial_nomenclature = {
                        title: title[i],
                        value: value[i]
                    }
                } else if (title[i] == "英文名称﻿") {
                    flower.basic_info.en_name = {
                        title: title[i],
                        value: value[i]
                    }
                    flower.basic_info.who_founed = {
                        title: title[i],
                        value: value[i]
                    }
                }
            }
            console.log(flower);

            var flowerDao = new FlowerDao();

            flowerDao.add(flower, function (e, count) {
                console.timeEnd("turn" + index);
                console.log(count + ":" + succulent_plants[index]);
                if (e) {
                    console.log(e);
                }
                if (count == succulent_plants.length) {
                    process.exit(0);
                } else {
                    index++;
                    upsertFlowers();
                }
            });
        }
    });

}

getSucculent_plants();
//var flowerDao = new FlowerDao();
//flowerDao.count(function (count) {
//    console.log("count:"+count);
//})