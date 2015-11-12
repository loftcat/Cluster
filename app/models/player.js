/**
 * Created by hebin on 2015/7/29.
 */
var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var playerSchema = new Schema({
    ch_name : String,
    en_name : String,
    age:Number,
    position :String,
    nationality : String,
    national_team : String,
    league : String,
    club : String,
    honor:String,
    info:String,
    num : String,
    weight : String,
    height :String,
    birthday :String,
    head:String,
    path:String
});

mongodb.mongoose.model("player", playerSchema);
var Player = mongodb.mongoose.model("player");
var count=0;
var PlayerDao = function () {
    this.add = function(ch_name,en_name,info,honor,num,nationality,weight,height,birthday,position,club,age,head,path,callback) {
        count++;
        Player.update({ch_name:ch_name},{ch_name:ch_name,en_name:en_name,age:age,position:position,
            club:club,num:num,weight:weight,height:height,birthday:birthday,nationality:nationality,
            honor:honor,info:info,head:head,path:path},{upsert:true},function(err){
            if(callback){
                callback(err,count);
            }
        });
        console.log(count)
    };

    this.delete = function(id, callback) {
        Player.remove({_id:id},function(err,docs){
            if(callback){
                callback(err,docs);
            }
        });
    };

    this.find = function(name, callback) {
        Player.find({name:name},function(err,docs) {
            if(callback){
                callback(err,docs);
            }
        });
    };
    this.findAll = function(callback) {
        Player.find(function(err,docs) {
            console.log(docs);
            if(callback){
                callback(err,docs);
            }
        });
    };
    this.deleteAll = function(callback) {
        Player.remove(function(err,docs){
            if(callback){
                callback(err,docs);
            }
        });
    };
    this.count = function(callback) {
        Player.count(function(err,count){
            if(callback){
                callback(count);
            }
        });
    };
}

module.exports= PlayerDao;