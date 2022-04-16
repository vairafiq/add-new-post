<?php
/**
 * Plugin Name:     Gutenberg Add New Post
 * Plugin URI:      https://exlac.com
 * Description:     Adds the missing "Add New" button of classic editor to the Block Editor toolbar, so you can easily create new posts/pages/custom post types, as well as duplicate or permanently delete post.
 * Author:          Rafiq
 * Text Domain:     vairafiq-anpg
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * @package         vairafiq-anpg
 */

/**
 * Registers all block assets so that they can be enqueued through Gutenberg in
 * the corresponding context.
 *
 */
function vairafiq_anpg_script() {

	$dir = dirname( __FILE__ );
	$index_js = 'build/index.js';
	$index_css = '/build/index.css';

	// automatically load dependencies and version
	$asset_file = include $dir . '/build/index.asset.php';
	wp_register_script(
		'vairafiq-anpg-js',
		plugins_url( $index_js, __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version']
	);
	wp_set_script_translations( 'vairafiq-anpg-js', 'vairafiq-anpg', plugin_dir_path(__FILE__) . 'languages/' );
	wp_enqueue_script(
		'vairafiq-anpg-js'
	);
	wp_enqueue_style(
		'vairafiq-anpg-style',
		plugins_url( $index_css, __FILE__ ),
		array( 'wp-edit-blocks' ),
		filemtime( plugin_dir_path( __FILE__ ) . $index_css )
	);
}

add_action( 'enqueue_block_editor_assets', 'vairafiq_anpg_script' );
add_action( 'init', 'vairafiq_anpg_script' );
