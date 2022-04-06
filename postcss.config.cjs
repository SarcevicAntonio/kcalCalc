const autoprefixer = require('autoprefixer');
const postcssNesting = require('postcss-nesting');
const postcssPresetEnv = require('postcss-preset-env');

const config = {
	plugins: [autoprefixer, postcssNesting, postcssPresetEnv]
};

module.exports = config;
