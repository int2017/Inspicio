var path = require('path');

module.exports = {
	entry: {
        "images_view": './Scripts/images_view.js',
        "multipleImages-New": './Scripts/multipleImages-New.js'
	},
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, 'wwwroot/dist/')
	},
	resolve: {
		extensions: [".js"]
	}
};
