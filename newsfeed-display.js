/*  Render onto a webbpage up to ARTICLES_PER_SOURCE articles for the nominated sources exported in
feedsource.js. Render all the sources in feedsource.js as enumerated up to _counts available sources. */


var http = require('http');
var feedparser = require('ortoo-feedparser');
var feeds = require('./feedsource');
// Allow optional command-line setting to produce verbose informational statements
var VERBOSE_LOGGING = Boolean(process.argv[2] && !!(process.argv[2].toLowerCase().match('verbose*')));

var TOTAL_FEEDS_TO_BE_PROCESSED = feeds._count();
var feeds_processed = []; // Running list of feeds being processed

var ARTICLES_PER_SOURCE = 10;

function log_informational(msg) {
    if (VERBOSE_LOGGING) {
        console.log(msg)
    }
}

function render_article_list_element(res, article) { // Consider express if we need to make this fancier
    res.write('<li style="color:blue">' + article.title + '</li>');
    res.write('<p>\n<small>\n<a href=' + article.link + '>' + article.link + '</a>\n</small>\n</p>');
    res.write('<p>\n<small>' + article.summary + '</small>\n</p>')
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
    log_informational('Rendering articles from feedsource ' + feedsource);
    parseStream.on('article', function(article) {
        if (articles_count < limit) {
            render_article_list_element(res, article);
            articles_count += 1
        }
    });
    parseStream.on('end', function() {
        log_informational('Already encountered feed sources: ' + feeds_processed);
        var feeds_processed_length = feeds_processed.length;
        if (feeds_processed.indexOf(feedsource) < 0) {
            log_informational('Adding feed ' + feedsource + ' with feeds_processed_length = ' + feeds_processed_length);
            feeds_processed.push(feedsource);
            feeds_processed_length += 1;
        };
        if (feeds_processed_length >= TOTAL_FEEDS_TO_BE_PROCESSED && // should be equal (greater never encountered)
            feedsource == feeds_processed[TOTAL_FEEDS_TO_BE_PROCESSED - 1]) {
            log_informational('All articles written from all feed sources: ' + feeds_processed);
            feeds_processed = [];
            res.write("</ol>\n</body>\n</html>\n");
            res.end()
        }
    });
    parseStream.on('error', function(error) {
        log_informational('Newsfeed parser encountered error ' + error.message);
        var enotfound_position = error.message.indexOf('ENOTFOUND');
        if (enotfound_position >= 0) {
            error = new Error('Your browser is not currently able to connect to' +
                error.message.substring(enotfound_position + 'ENOTFOUND'.length))
        };
        render_error_conditon(res, error)

    })
};

/* Exported functions to test */
module.exports = {
    renderArticlesFromSource: renderArticlesFromSource,
    render_article_list_element: render_article_list_element,
    render_error_conditon: render_error_conditon
};

/* node.js server launch */
http.createServer(function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html',
        "Transfer-Encoding": "chunked"
    });
    res.write("<html>\n<title>\nLatest news headlines</title>\n<body>\n<ol>");
    renderArticlesFromSource(feeds.bbc(), res, ARTICLES_PER_SOURCE);
    renderArticlesFromSource(feeds.sky(), res, ARTICLES_PER_SOURCE);


}).listen(8124);

log_informational('Server running at http://localhost:8124/');