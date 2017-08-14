var path = require('path');

module.exports = {
	entry: {
        "multipleImages": './Scripts/multipleImages.js',
		"ajaxScreens": './Scripts/ajaxScreens.js'
	},
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, 'wwwroot/dist/')
	},
	resolve: {
		extensions: [".js"]
    }
  
};


