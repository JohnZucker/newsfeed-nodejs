 var request = require('superagent');
 var expect = require('expect.js');

 describe('news headlines page', function() {
     this.timeout(30000);

     it("should get 'news headlines' and contain 20 listed articles", function(done) {

         request('GET', 'http://localhost:8124/').end(function(res) {
             // console.log('res is ' + typeof res);
             expect(res).to.exist;
             expect(res.text).to.contain('news');
             assert.equal(res.status, 200, '200 status code returned');
             assert.equal(res.text.match(/<li/g).length, 20, 'Expected count of list terminations found');
             assert.equal(res.text.match(/<\/li/g).length, 20, 'Expected count of list terminations found')

             done();
         });
     });

 });