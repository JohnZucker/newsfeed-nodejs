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

To test locally, (optionally) using verbose (command argurment verbose\*, VERBOSE\*) logging,

    $ node newsfeed-display.js verbose &
    Server running at http://localhost:8124/

Expected console logging

    Rendering articles from feedsource http://feeds.bbci.co.uk/news/rss.xml    
    Rendering articles from feedsource http://feeds.skynews.com/feeds/rss/home.xml    
    Already encountered feed sources:     
    Adding feed http://feeds.skynews.com/feeds/rss/home.xml with feeds_processed_length = 0     
    Already encountered feed sources: http://feeds.skynews.com/feeds/rss/home.xml    
    Adding feed http://feeds.bbci.co.uk/news/rss.xml with feeds_processed_length = 1

Webpage output should resemble

![newsfeed-nodejs-webpage-example.png](https://github.com/JohnZucker/newsfeed-nodejs/blob/master/newsfeed-nodejs-webpage-example.png)

For simple 'walkthrough' tests using a 'mocked by hand' implementation of the HttpRequest as file output for analysis, see subdirectory handmocked.

# Automated tests

To establish regression baseline.

Test tool dependencies

- nock ... HTTP 'interception' mocking library for node.js    
https://github.com/pgte/nock
- mocha ... Testing framework for node.js and browser code op semantics    
https://github.com/mochajs/mocha

nock is used to intercept http responses and write data into string newsfeedRecordedCallResponse in the test http-request-test.js.

To execute tests 

    $ mocha test
