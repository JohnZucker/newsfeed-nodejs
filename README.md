# newsfeed-nodejs
Webpage to display newsfeed content by running server-side javascript

# Project brief

Create news website with the following requirements :

- Display top 10 headlines from the BBC and SKY on a webpage
- Use a node.js server
- All data to go through the nodejs server
     
# Source control

https://github.com/JohnZucker/newsfeed-nodejs    

# Server used for tests

node v0.13.0-pre    
npm 2.3.0    
Darwin 12.5.0 Darwin Kernel Version 12.5.0    

## Installation 
As https://gist.github.com/isaacs/579814#file-only-git-all-the-way-sh         
Requires node and npm    
 
    $ npm install

# News feeds used

* http://feeds.bbci.co.uk/news/rss.xml
* http://feeds.skynews.com/feeds/rss/home.xml

    * Conditions: For terms see http://www.bbc.co.uk/terms/additional_rss.shtml, http://news.sky.com/info/rss

# Test runs

To test locally,

    $ node newsfeed-display.js &
    Server running at http://localhost:8124/

Expected console logging

    Rendering articles from feedsource http://feeds.skynews.com/feeds/rss/home.xml
    Rendering articles from feedsource http://feeds.bbci.co.uk/news/rss.xml
    All articles written from final feed source

Webpage output should resemble

![newsfeed-nodejs-webpage-example.png](https://github.com/JohnZucker/newsfeed-nodejs/blob/master/newsfeed-nodejs-webpage-example.png)
