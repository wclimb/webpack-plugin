const fs = require('fs');
class TestPlugin {
  constructor(options = {}) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.emit.tapAsync('TestPlugin', (compilation, callback) => {
      let template = fs.readFileSync(this.options.template, 'UTF-8');
      compilation.assets[this.options.filename || 'test.js'] = {
        source: function() {
          return template;
        },
        size: function() {
          return template.length;
        },
      };

      let source = compilation.assets['index.html'].source();
      source = source.replace(
        /<\/(.*?)>(.*?)<\/body>$/m,
        '</$1><script src="./test.js"></script></body>',
      );

      compilation.assets['index.html'] = {
        source: function() {
          return source;
        },
        size: function() {
          return source.length;
        },
      };

      callback();
    });
  }
}

module.exports = TestPlugin;
