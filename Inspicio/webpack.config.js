var path = require('path');
var sourcePath = path.join(__dirname, 'Scripts');

module.exports = {
	entry: {
		"images_view": './Scripts/images_view.js',
		"ExampleReactComponent": './Scripts/ExampleReactComponent.jsx',
	
	
	},
	output: {
		filename: "[name].bundle.js",
		path: path.resolve(__dirname, 'wwwroot/dist/')
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
				},
			},
		],
	},
	resolve: {
		extensions: [".js", ".jsx"],
		modules: [
			path.resolve(__dirname, 'node_modules'),
			sourcePath
		]
	}
};
