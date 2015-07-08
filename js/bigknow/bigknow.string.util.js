/**
 * Created by jiang on 2/27/2015.
 */
function generateString(prefix, randomNumber) {
    if(randomNumber<=0) {
        return prefix;
    }

    var arr="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    var result = "";
    for(var i = 0; i<randomNumber; i++) {
        result += arr[Math.floor(Math.random()*52)];
    }

    return prefix + result;
}