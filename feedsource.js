// Feedsources under test. Extend as needed with keyword to name source.

var feeds = {
    sky: 'http://feeds.skynews.com/feeds/rss/home.xml',
    bbc: 'http://feeds.bbci.co.uk/news/rss.xml'
};

exports.sky = function() {
    return feeds.sky
}
exports.bbc = function() {
    return feeds.bbc
}
exports._count = function() {
    return Object.keys(feeds).length
}