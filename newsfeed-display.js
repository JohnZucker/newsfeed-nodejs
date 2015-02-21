var http = require('http');
var feedparser = require('ortoo-feedparser');
var feeds = require('./feedsource');

var TOTAL_FEEDS_TO_BE_PROCESSED = feeds._count();
var feeds_processed = []; // Running list of feeds being processed

var ARTICLES_PER_SOURCE = 10;

function render_article_list_element(res, article) { // Consider express if we need to make this fancier
    res.write('<li style="color:blue">' + article.title + '</li>');
    res.write('<p>\n<small>\n<a href=' + article.link + '>' + article.link + '</a>\n</small>\n</p>');
    res.write('<p>\n<small>' + article.summary + '</small>\n</p>');
}

function render_error_conditon(res, error) { // Consider express if we need to make this fancier
    res.write('<h2>Unexpected interruption, please retry later</h2>');
    res.write('<p>Something prevented your news feed completing your news summary.</p>');
    res.write('<p> ' + error.message + ' </p>')
}

function renderArticlesFromSource(feedsource, res, limit) {
    var parseStream;
    try {
        parseStream = feedparser.parseUrl(feedsource);
    } catch (e) {
        throw new Error("Cannot connect " + e.name);
    }
    if (typeof parseStream == 'undefined') {
        throw new Error("Cannot connect");
    }
    var articles_count = 0;
    console.log('Rendering articles from feedsource ' + feedsource);
    parseStream.
    on('article', function(article) {
        if (articles_count < limit) {
            render_article_list_element(res, article);
            articles_count += 1
        }
    });
    parseStream.
    on('end', function() {
        console.log('Already encountered feed sources: ' + feeds_processed);
        var feeds_processed_length = feeds_processed.length;
        if (feeds_processed.indexOf(feedsource) < 0) {
            console.log('Adding feed ' + feedsource + ' with feeds_processed_length = ' + feeds_processed_length);
            feeds_processed.push(feedsource);
            feeds_processed_length += 1;
        } else if (feeds_processed_length >= TOTAL_FEEDS_TO_BE_PROCESSED && feedsource == feeds_processed[TOTAL_FEEDS_TO_BE_PROCESSED]) {
            console.log('All articles written from all feed sources: ' + feeds_processed);
            feeds_processed = [];
            res.write("</ol>\n</body>\n");
            res.end()
        }
    });
    parseStream.on('error', function(error) {
        console.log('Newsfeed parser encountered error' + error.name);
        console.log(error.message);
        throw new Error(error.message)
    })
}
exports.renderArticlesFromSource = function(feedsource, res, limit) { // For test
    renderArticlesFromSource(feedsource, res, limit);
}

http.createServer(function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html',
        "Transfer-Encoding": "chunked"
    });
    res.write("<html>\n<title>\nLatest news headlines</title>\n<body>\n<ol>");
    try {
        renderArticlesFromSource(feeds.bbc(), res, ARTICLES_PER_SOURCE);
        renderArticlesFromSource(feeds.sky(), res, ARTICLES_PER_SOURCE);
    } catch (err) {
        console.log("Encountered error" + err.name);
        render_error_conditon(res, err)
    }

}).listen(8124);

console.log('Server running at http://localhost:8124/');