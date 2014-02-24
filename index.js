'use strict';

var Q = require('q');
var request = Q.denodeify(require('request'));

var chromecastHomeURL = 'https://clients3.google.com/cast/chromecast/home/v/c9541b08';
var initJSONStateRegex = /(JSON\.parse\(.+'\))/;

var parseChromecastHome = function(htmlString) {
    var JSONParse = htmlString.match(initJSONStateRegex)[1];
    var initState = eval(JSONParse); // I don't know why this is ok but JSON.parse fails.
    var parsedBackgrounds = [];
    for (var i in initState[1]) {
        var backgroundEntry = {
            url: initState[1][i][1],
            author: initState[1][i][2]
        };
        parsedBackgrounds.push(backgroundEntry);
    }
    return parsedBackgrounds;
};

module.exports = function() {
    return request(chromecastHomeURL).then(function(requestResult) {
        return parseChromecastHome(requestResult[1]);
    });
};
