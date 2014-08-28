var assert = require("assert")
var serve = require("../serve")



describe('IonicServe', function(){
  describe('#serve.run()', function(){
    it('should run', function(){
			var ret = serve.run();
			console.log(ret);
      assert.equal(ret, 'run');
    })
  })
})