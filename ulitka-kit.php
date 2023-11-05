<?php

/**
 * Plugin Name:       Ulitka Kit
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       ulitka-kit
 *
 * @package           create-block
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */

// Exit if accessed directly.
defined('ABSPATH') || exit;

function custom_block_category($categories, $post)
{
	return array_merge(
		array(
			array(
				'slug' => 'ulitka-custom',
				'title' => 'Ulitka Custom Blocks',
			),
		),
		$categories
	);
}



add_filter('block_categories_all', 'custom_block_category', 10, 2);

function ulitka_kit_block_init()
{
	$build_dir = __DIR__ . '/build/blocks/';

	// Сканируем директорию build на наличие директорий блоков
	$dirs = glob($build_dir . '*', GLOB_ONLYDIR);

	foreach ($dirs as $dir) {
		// Регистрируем каждый блок
		register_block_type($dir);
	}
}
add_action('init', 'ulitka_kit_block_init');

function enqueue_editor_scripts()
{


	$build_dir = plugin_dir_path(__FILE__) . 'build/';
	$build_url = plugin_dir_url(__FILE__) . 'build/';
	// Scan the build directory and its subdirectories for JavaScript and CSS files
	$js_files = glob($build_dir . 'js/{,*/,*/*/,*/*/*/}*.js', GLOB_BRACE);


	foreach ($js_files as $file) {
		$filename = basename($file, '.js');
		$relative_path = str_replace($build_dir, '', $file);
		$relative_dir = dirname($relative_path);
		$asset_file = $build_dir . $relative_dir . '/' . $filename . '.asset.php';

		if (file_exists($asset_file)) {
			$script_asset = include $asset_file;

			wp_enqueue_script(
				'ulitka_kit-' . $filename,
				$build_url . $relative_path,
				$script_asset['dependencies'],
				$script_asset['version']
			);
		}
	}
}

add_action('enqueue_block_editor_assets', 'enqueue_editor_scripts');

function enqueue_plugin_styles()
{


	$build_dir = plugin_dir_path(__FILE__) . 'build/';
	$build_url = plugin_dir_url(__FILE__) . 'build/';

$css_files = glob($build_dir . 'css/{,*/,*/*/,*/*/*/}*.css', GLOB_BRACE);

	foreach ($css_files as $file) {
		$filename = basename($file, '.css');
		$relative_path = str_replace($build_dir, '', $file);
		$relative_dir = dirname($relative_path);
		$asset_file = $build_dir . $relative_dir . '/' . $filename . '.asset.php';

		if (file_exists($asset_file)) {
			$style_asset = include $asset_file;

			wp_enqueue_style(
				'ulitka_kit-' . $filename,
				$build_url . $relative_path,
				isset($style_asset['dependencies']) ? $style_asset['dependencies'] : array(),
				isset($style_asset['version']) ? $style_asset['version'] : false
			);
		} else {
			wp_enqueue_style(
				'ulitka_kit-' . $filename,
				$build_url . $relative_path
			);
		}
	}
}

add_action('wp_enqueue_scripts', 'enqueue_plugin_styles');
add_action('enqueue_block_editor_assets', 'enqueue_plugin_styles');
