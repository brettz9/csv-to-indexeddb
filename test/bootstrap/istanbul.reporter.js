// Courtesy of https://github.com/artberri/rollup-plugin-istanbul/issues/11
/* globals require, module */
/* eslint-disable import/unambiguous, import/no-commonjs */

const instanbul = require('istanbul');
const MochaSpecReporter = require('mocha/lib/reporters/spec');

module.exports = function (runner) {
  const collector = new instanbul.Collector();
  const reporter = new instanbul.Reporter();
  reporter.addAll(['lcov', 'json']);
  new MochaSpecReporter(runner); // eslint-disable-line no-new

  runner.on('end', function () {
    collector.add(global.__coverage__);

    reporter.write(collector, true, function () {
      console.log('report generated');
    });
  });
};
