const { resolve: r } = require( "path" );
const { pApp, pTest } = require( "../paths" );
const { isTestTarget } = require( "../utils" );

const webpack = require( "webpack" );
const HtmlWebpackPlugin = require( "html-webpack-plugin" );


/**
 * Configurations for creating valid NW.js builds
 */
module.exports = {
	common( config, grunt, target ) {
		const path = isTestTarget( target )
			? pTest
			: pApp;
		const isProd = target === "prod";

		// split chunks
		config.plugins.unshift(
			new webpack.optimize.SplitChunksPlugin()
		);

		// NW.js package.json
		config.module.rules.push({
			include: [
				r( pApp, "package.json" ),
				r( pTest, "package.json" )
			],
			type: "asset/resource",
			generator: {
				filename: "package.json"
			},
			use: {
				loader: "parse-json-loader",
				options: {
					grunt
				}
			}
		});

		// generate the index.html
		config.plugins.push(
			new HtmlWebpackPlugin({
				minify: isProd && {
					collapseWhitespace: true
				},
				inject: "body",
				hash: false,
				template: r( path, "index.html" )
			})
		);
	}
};
