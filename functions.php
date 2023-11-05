<?php

// Register and enqueue stylesheets

add_action('init','ulitkaaroma_register_and_enqueue_styles');

function ulitkaaroma_register_and_enqueue_styles() {
	wp_register_style(
		'ulitkaaroma-style',
		get_template_directory_uri() . '/style.css',
		array()
	);
	wp_enqueue_style(
		'ulitkaaroma-style'
	);
};

function new_block_style ($block, $name, $label){
	register_block_style(
		$block, array(
			'name' => $name,
			'label' => __($label, 'ulitkaaroma')
		));
}

add_action('init', 'ulitkaaroma_register_block_styles');
function ulitkaaroma_register_block_styles()
{
	new_block_style('core/group', 'height-2px', 'Высота 2px');
	new_block_style('core/group', 'height-20px', 'Высота 20px');
	new_block_style('core/button', 'secondary-button', 'Серая кнопка');
	new_block_style('core/button', 'rounded-button', 'Круглая кнопка');
	new_block_style('core/columns', 'column-reverse-mobile', 'Отразить на мобильных устройствах');
	new_block_style('core/navigation-link', 'hide-on-mobile', 'Спрятать на мобильных устройствах');
	new_block_style('core/site-logo', 'hide-on-mobile', 'Спрятать на мобильных устройствах');
}
