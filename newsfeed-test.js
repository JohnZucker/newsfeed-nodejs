var http = require('http');
var feedparser = require('ortoo-feedparser');
var feedsource1 = 'http://feeds.skynews.com/feeds/rss/home.xml';
var feedsource2 = 'http://feeds.bbci.co.uk/news/rss.xml'

var ARTICLES_PER_SOURCE = 10;

function renderArticlesFromSource(feedsource, res, limit, final) {
    var parseStream = feedparser.parseUrl(feedsource);
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
article = { title: 'test1_title', link: 'test1_link', summary: 'test1_summary' }

// Dummy stream so as to simulate HTTP Response
var fs = require('fs');
var res = fs.createWriteStream('test1_output.txt');
res.write("<html>\n<title>\nLatest news headlines</title>\n<body>\n<ol>");
renderArticlesFromSource(feedsource1, res, ARTICLES_PER_SOURCE, false);
res.on('finish', function () {
  console.log('Dummy file has been written');
});
res.end();
