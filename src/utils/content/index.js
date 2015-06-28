const lib = {};

export default lib;

if (process.browser) {
  throw new Error('Not yet implemented for browsers');
} else {
  Object.assign(lib, require('./serverContent.js'));
}
