var http = require('http');
var feedparser = require('ortoo-feedparser');
var feedsource1 = 'http://feeds.skynews.com/feeds/rss/home.xml';
var feedsource2 = 'http://feeds.bbci.co.uk/news/rss.xml'

http.createServer(function (req, res) {

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write("<html>\n<title>\nLatest news headlines</title>\n<body>\n<ul>");
    var parseStream=feedparser.parseUrl(feedsource2);
    parseStream.
        on('article', function(article){
            res.write('<li style="color:blue">' + article.title + '</li>');
            res.write('<p>\n<small>\n<a href=' + article.link + '>' + article.link + '</a>\n</small>\n</p>');
            res.write('<p>\n<small>' + article.summary + '</small>\n</p>');
        });
    parseStream.
       on('end', function(){
            res.write("</ul>\n</body>\n"); 
            res.end()
        }); 

  }).listen(8124);

console.log('Server running at http://localhost:8124/');
