/* Serverless test, at node prompt
To test
catch Error: write after end
catch Error: getaddrinfo ENOTFOUND feeds.skynews.com */

// npm install underscore
var __ = require('underscore');

var http = require('http');
var feedparser = require('ortoo-feedparser');
var feedsource1 = 'http://feeds.skynews.com/feeds/rss/home.xml';
var feedsource2 = 'http://feeds.bbci.co.uk/news/rss.xml'

var ARTICLES_PER_SOURCE = 10;

function renderArticlesFromSource(feedsource, res, limit, final) {
    try {
        var parseStream = feedparser.parseUrl(feedsource);
    } catch (e) {
        throw new Error("Cannot connect " + e.name);
    }
    if (typeof parseStream == 'undefined') {
        return new Error("Cannot connect");
    }
    var articles_count = 0;
    console.log('Rendering articles from feedsource ' + feedsource);
    parseStream.
    on('article', function(article) {
        if (articles_count < limit) {
            res.write('<li style="color:blue">' + article.title + '</li>');
            res.write('<p>\n<small>\n<a href=' + article.link + '>' + article.link + '</a>\n</small>\n</p>');
            res.write('<p>\n<small>' + article.summary + '</small>\n</p>');
            articles_count += 1
        }
    });
    parseStream.
    on('end', function() {
        if (final) {
            console.log('All articles written from final feed source')
            res.write("</ol>\n</body>\n");
            res.end()
        }
    });
}

// Dummy values
test_article = {
    title: 'test1_title',
    link: 'test1_link',
    summary: 'test1_summary'
};
var TEST_CYCLES_PER_SOURCE = 5

// Dummy stream so as to simulate HTTP Response
var test_fs = require('fs');
var test_res = test_fs.createWriteStream('test1_output.txt');
test_res.on('finish', function() {
    console.log('Dummy file has been written');
});

// Repeated test 1
exports.function disconnected_test(res) {
    res.write("<html>\n<title>\nLatest news headlines</title>\n<body>\n<ol>");
    __.times(
        TEST_CYCLES_PER_SOURCE,
        function() {
            res.write('<li style="color:blue">' + test_article.title + '</li>');
            res.write('<p>\n<small>\n<a href=' + test_article.link + '>' + test_article.link + '</a>\n</small>\n</p>');
            res.write('<p>\n<small>' + test_article.summary + '</small>\n</p>');
        });
    /* res.end();  // To test if never closed */
}

// Repeated test 2
exports.function connected_test(res) {
    __.times(
        TEST_CYCLES_PER_SOURCE,
        function() {
            renderArticlesFromSource(feedsource1, res, ARTICLES_PER_SOURCE, false);
        });
    /* res.end();  // To test if never closed */
}