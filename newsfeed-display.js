var http = require('http');
var feedparser = require('ortoo-feedparser');
var feedsource1 = 'http://feeds.skynews.com/feeds/rss/home.xml';

http.createServer(function (req, res) {

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write("<html>\n<title>\nLatest news headlines</title>\n<body>\n<ul>");
    var parseStream=feedparser.parseUrl(feedsource1);
    parseStream.
        on('article', function(article){
            res.write('<li>' + article.title + '</li>')
        });
    parseStream.
       on('end', function(){
            res.write("</ul>\n</body>\n"); 
            res.end()
        }); 

  }).listen(8124);

console.log('Server running at http://localhost:8124/');
