<?php

/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$containerColor = $attributes["containerColor"];
$buttonImageID = isset($attributes["buttonImageID"]) ? $attributes["buttonImageID"] : null;

$buttonColor = $attributes["buttonColor"];
$burgerColor = $attributes["burgerColor"];
$backgroundBlur = $attributes["backgroundBlur"];

function render_image_if_set($imageID, $alt_text)
{
    if (!empty($imageID)) {
        $imageUrl = wp_get_attachment_url($imageID);
        if ($imageUrl) {
            echo '<img src="' . $imageUrl . '" class="button-image" alt="' . $alt_text . '" />';
        }
    }
}


?>

<div class="navigation-outer-wrapper">
    <div <?php echo get_block_wrapper_attributes(["class" => 'navigation-wrapper']); ?> style="background-color: <?php echo $containerColor; ?>; backdrop-filter: blur(<?php echo $backgroundBlur; ?>px);">
        <?php echo $content; ?>
    </div>
    <div class="navigation-button-wrapper">
        <button class="navigation-button" style="background-color: <?php echo $buttonColor; ?>" aria-label="Toggle navigation" role="button" tabindex="0" type="button">
            <span class="burger-line" style="background-color: <?php echo $burgerColor; ?>"></span>
            <span class="burger-line" style="background-color: <?php echo $burgerColor; ?>"></span>
            <span class="burger-line" style="background-color: <?php echo $burgerColor; ?>"></span>
        </button>
        <?php 
            $alt_text = get_post_meta($buttonImageID , '_wp_attachment_image_alt', true);
            if (empty($alt_text)) {
                $alt_text = "";
            }
            render_image_if_set($buttonImageID, $alt_text); 
        ?>
    </div>
</div>