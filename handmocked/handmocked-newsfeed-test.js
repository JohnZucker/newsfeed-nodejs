/* Serverless test, at node prompt
Creates a dummy response stream to test file, i.e. mocking the response 'by hand'
Was used to test
catch Error: write after end
catch Error: getaddrinfo ENOTFOUND feeds.skynews.com 

* Can be run interactively freom the test subdirectory as
$ node
test2 = require('./newsfeed-test.js')
test2.disconnected_test()
test2.connected_test()
and tail the file defined in this module as the value of test_res
*/

// npm install underscore
var __ = require('underscore');

//var http = require('http');
//var feedparser = require('ortoo-feedparser');
//var feedsource1 = 'http://feeds.skynews.com/feeds/rss/home.xml';
//var feedsource2 = 'http://feeds.bbci.co.uk/news/rss.xml';
var feeds = require('../feedsource');

var ARTICLES_PER_SOURCE = 10;

var target_behaviour = require('../newsfeed-display');
// To test functions renderArticlesFromSource, 

var TOTAL_FEEDS_TO_BE_PROCESSED = feeds._count();
var feeds_processed = []; // Running list of feeds being processed

var ARTICLES_PER_SOURCE = 10;

//target_behaviour.renderArticlesFromSource(feedsource, res, limit);


// Dummy values
test_article = {
    title: 'test2_title',
    link: 'test2_link',
    summary: 'test2_summary'
};
var TEST_CYCLES_PER_SOURCE = 5

// Dummy stream so as to simulate HTTP Response
var test_fs = require('fs');
var test_res = test_fs.createWriteStream('test2_output.txt');
test_res.on('finish', function() {
    console.log('\nDummy file has been written');
});

// Repeated first test
exports.disconnected_test = function() {
    test_res.write("<html>\n<title>\nLatest news headlines</title>\n<body>\n<ol>");
    __.times(
        TEST_CYCLES_PER_SOURCE,
        function() {
            target_behaviour.render_article_list_element(test_res, test_article)
        });
    test_res.write("</ol>\n</body>\n");
}

//Repeated second test
exports.connected_test = function() {
    __.times(
        TEST_CYCLES_PER_SOURCE,
        function() {
            target_behaviour.renderArticlesFromSource(feeds.bbc(), test_res, ARTICLES_PER_SOURCE);
            target_behaviour.renderArticlesFromSource(feeds.sky(), test_res, ARTICLES_PER_SOURCE);
        });
    test_res.end();
}