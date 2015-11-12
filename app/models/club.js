/**
 * Created by hebin on 2015/7/29.
 */
var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var clubSchema = new Schema({
    name : String,
    desc :String,
    pic : String,
    league_type : Number,
    league : String
});

mongodb.mongoose.model("club", clubSchema);
var Club = mongodb.mongoose.model("club");
var count=0;
var ClubDao = function () {
    this.add = function(name,pic,desc,league_type,league,callback) {
        Club.update({name:name},{name:name,pic:pic,desc:desc,league_type:league_type,league:league},{upsert:true},function(err){
            console.log(name);
            count++;
            if(callback){
                callback(err,count);
            }
        });
    };

    this.delete = function(id, callback) {
        Club.remove({_id:id},function(err,docs){
            if(callback){
                callback(err,docs);
            }
        });
    };

    this.find = function(name, callback) {
        Club.find({name:name},function(err,docs) {
            if(callback){
                callback(err,docs);
            }
        });
    };
    this.findAll = function(callback) {
        Club.find(function(err,docs) {
            console.log(docs);
            if(callback){
                callback(err,docs);
            }
        });
    };
    this.deleteAll = function(callback) {
        Club.remove(function(err,docs){
            if(callback){
                callback(err,docs);
            }
        });
    };
    this.count = function(callback) {
        Club.count(function(err,count){
            if(callback){
                callback(count);
            }
        });
    };
}

module.exports= ClubDao;