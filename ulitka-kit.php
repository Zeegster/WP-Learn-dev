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

function get_script_asset($file)
{

    $asset_file = $file;

    if (strpos($file, '.js') !== false) {
        $asset_file = str_replace('.js', '.asset.php', $file);
    }

    if (file_exists($asset_file)) {
        return include $asset_file;
    }

    return [
        'dependencies' => [],
        'version' => ''
    ];
}


function enqueue_scripts()
{

    $build_dir = plugin_dir_path(__FILE__) . 'build/';
    $build_url = plugin_dir_url(__FILE__) . 'build/';

    $js_files = glob($build_dir . 'js/{,*/,*/*/,*/*/*/}*.js', GLOB_BRACE);

    foreach ($js_files as $file) {

        $filename = basename($file, '.js');
        $relative_path = str_replace($build_dir, '', $file);

        $script_asset = get_script_asset($file);
        $dependencies = $script_asset['dependencies'];
        $version = $script_asset['version'];

        if (strpos($relative_path, 'editor') !== false) {
            add_action('enqueue_block_editor_assets', function () use ($filename, $build_url, $relative_path, $dependencies, $version) {
                wp_enqueue_script('ulitka_kit-' . $filename, $build_url . $relative_path, $dependencies, $version);
            });
        } else if (strpos($relative_path, 'frontend') !== false) {
            add_action('wp_enqueue_scripts', function () use ($filename, $build_url, $relative_path, $dependencies, $version) {
                wp_enqueue_script('ulitka_kit-' . $filename, $build_url . $relative_path, $dependencies, $version);
            });
        } else if (strpos($relative_path, 'admin') !== false) {
            add_action('admin_enqueue_scripts', function () use ($filename, $build_url, $relative_path, $dependencies, $version) {
                wp_enqueue_script('ulitka_kit-' . $filename, $build_url . $relative_path, $dependencies, $version);
            });
        } else {
            add_action('wp_enqueue_scripts', function () use ($filename, $build_url, $relative_path, $dependencies, $version) {
                wp_enqueue_script('ulitka_kit-' . $filename, $build_url . $relative_path, $dependencies, $version);
            });
            add_action('admin_enqueue_scripts', function () use ($filename, $build_url, $relative_path, $dependencies, $version) {
                wp_enqueue_script('ulitka_kit-' . $filename, $build_url . $relative_path, $dependencies, $version);
            });
        }
    }
}

enqueue_scripts();

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


function ulitka_kit_register_block_styles() {
    register_block_style(
        'core/post-template',
        array(
            'name'         => 'card',
            'label'        => 'Карточка с анимацией',
        )
    );
    register_block_style(
        'core/post-excerpt',
        array(
            'name'         => 'styled-link',
            'label'        => 'Доп. стили ссылки',
        )
    );
}
add_action('init', 'ulitka_kit_register_block_styles');