var path = require('path');

module.exports = {
	entry: {
		"images_view": './Scripts/images_view.js'	
	},
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, 'wwwroot/dist/')
	},
	resolve: {
		extensions: [".js"]
	}
};

module.exports = {
    entry: {
        "ajaxScreens": './Scripts/ajaxScreens.js',
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, 'wwwroot/dist/')
    },
    resolve: {
        extensions: [".js"]
    }
};