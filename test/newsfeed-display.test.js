 var request = require('superagent');
 assert = require('assert');
 var expect = require('expect.js');

 /* Precompute required number of articles per test run */
 var TOTAL_FEEDS_TO_BE_PROCESSED = require('../feedsource')._count()
 var ARTICLES_PER_SOURCE = 10; // TODO - consider exporting this value from newsfeed-display.js
 var TOTAL_ARTICLES_EXPECTED = TOTAL_FEEDS_TO_BE_PROCESSED * ARTICLES_PER_SOURCE;


 describe('news headlines page', function() {
     this.timeout(5000);

     it('should get \'news headlines\' and contain ' + TOTAL_ARTICLES_EXPECTED + ' listed articles', function(done) {

         request('GET', 'http://localhost:8124/').end(function(res) {
             //console.log('res is ' + typeof res);
             console.log('    TOTAL_ARTICLES_EXPECTED is ' + TOTAL_ARTICLES_EXPECTED);
             expect(res).to.exist;
             expect(res.text).to.contain('news');
             assert.equal(res.status, 200, '200 status code returned');
             assert.equal(res.text.match(/<li/g).length, TOTAL_ARTICLES_EXPECTED, 'Expected count of list terminations found');
             assert.equal(res.text.match(/<\/li/g).length, TOTAL_ARTICLES_EXPECTED, 'Expected count of list terminations found')

             done();
         });
     });

 });