/**
 * Created by loftcat on 2015/11/10.
 */
function removeAllSpace(str) {
    return str.replace(/\s+/g, "");
}
var strWithoutEmpty = function (str, normal) {
    if (str === null) {
        return normal;
    }
    return str == "" ? normal : str;
}

var isEmpty=function(str){
    if (str === null||str=="") {
        return true;
    }
    return false;
}

exports.removeAllSpace =removeAllSpace;
exports.isEmpty =isEmpty;
exports.strWithoutEmpty=strWithoutEmpty;