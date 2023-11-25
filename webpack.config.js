// Import original config from the @wordpress/scripts package.
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
// Import helper to find and generate the entry points in the src directory.
const { getWebpackEntryPoints } = require( '@wordpress/scripts/utils/config' );

// Plugins.
const RemoveEmptyScriptsPlugin = require( 'webpack-remove-empty-scripts' );

// Utilities.
const path = require( 'path' );
const fs = require( 'fs' );

// Функция для получения точек входа из каталога
function getAdditionalEntryPoints( srcDir, buildDir, fileExtension ) {
	const entryPoints = {};

	function processDir( currentDir ) {
		const files = fs.readdirSync( currentDir );

		files.forEach( ( file ) => {
			const filePath = path.join( currentDir, file );
			const fileStat = fs.statSync( filePath );

			if ( fileStat.isDirectory() ) {
				processDir( filePath );
			} else {
				if ( path.extname( file ) === fileExtension ) {
					const fileNameWithoutExtension = path.basename(
						file,
						fileExtension
					);
					const outputPath = path.join(
						buildDir,
						path.relative( srcDir, currentDir ),
						fileNameWithoutExtension +
							'/' +
							fileNameWithoutExtension
					);
					const entryKey = outputPath.replace( /\\/g, '/' );
					entryPoints[ entryKey ] = filePath;
				}
			}
		} );
	}

	processDir( srcDir );

	return entryPoints;
}

// Получаем дополнительные точки входа для JS и SCSS файлов
const jsEntryPoints = getAdditionalEntryPoints(
	path.resolve( process.cwd(), 'src/js' ),
	'js',
	'.js'
);
const scssEntryPoints = getAdditionalEntryPoints(
	path.resolve( process.cwd(), 'src/scss' ),
	'css',
	'.scss'
);

module.exports = Object.assign( {}, defaultConfig, {
	entry: Object.assign(
		{},
		getWebpackEntryPoints(),
		jsEntryPoints,
		scssEntryPoints
	),
	plugins: [
		...defaultConfig.plugins,
		// Удаляем пустые скрипты, которые могут быть созданы в результате объединения точек входа
		// Remove empty scripts that may be created as a result of merging entry points
		new RemoveEmptyScriptsPlugin( {
			stage: RemoveEmptyScriptsPlugin.STAGE_AFTER_PROCESS_PLUGINS,
		} ),
	],
} );
