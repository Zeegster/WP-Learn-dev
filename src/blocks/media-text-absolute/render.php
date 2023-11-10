<?php

/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */


$image_id = $attributes["imageID"];
$inner_block_position = $attributes["innerBlockPosition"];

?>
<div <?php echo get_block_wrapper_attributes(["class" => 'relative-block image-wrapper']); ?>>

	<?php echo wp_get_attachment_image($image_id, "full"); ?>

	<div <?php echo get_block_wrapper_attributes(["class" => 'is-position-' . $inner_block_position]); ?>>
		<?php echo $content; ?>
	</div>
</div>