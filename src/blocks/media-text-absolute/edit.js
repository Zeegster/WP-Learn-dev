/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	useBlockProps,
	MediaPlaceholder,
	InspectorControls,
	InnerBlocks,
} from "@wordpress/block-editor";

import { PanelBody, PanelRow , SelectControl } from "@wordpress/components";
/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */

const ALLOWED_BLOCKS = ["core/buttons", "core/heading", "core/paragraph"];

const MY_TEMPLATE = [
	["core/paragraph", { placeholder: "Мы заботимся о мире вокруг, а потому…" }],
	[
		"core/paragraph",
		{
			placeholder:
				"сдавая тару,`$<br>`Вы получаете скидку`$<br>`на новую покупку у нас!",
		},
	],
	["core/buttons", {}, [["core/button", { placeholder: "For test inly..." }]]],
];

export default function Edit({ attributes, setAttributes }) {
	return (
		<>
			{/* Inspector Zone */}
			<InspectorControls>
				<PanelBody title="Settings">
					<SelectControl
						label="Внутреннее позиционирование"
						desc="Как позиционировать внутреннее содержимое блока? 'ось X' 'ось Y'"
						onChange={(val) => setAttributes({ inner_block_position: val })}
						value={attributes.inner_block_position}
						options={[
							{
								label: "Центр Центр",
								value: "center-center",
							},
							{
								label: "Центр Слева",
								value: "center-left",
							},
							{
								label: "Центр Справа",
								value: "center-right",
							},
							{
								label: "Сверху Центр",
								value: "top-center",
							},
							{
								label: "Сверху Справа",
								value: "top-right",
							},
							{
								label: "Сверху Слева",
								value: "top-left",
							},
							{
								label: "Снизу Центр",
								value: "bottom-center",
							},
							{
								label: "Снизу Справа",
								value: "bottom-right",
							},
							{
								label: "Cнизу Слева",
								value: "bottom-left",
							},
						]}
					/>
				</PanelBody>
			</InspectorControls>
			{/* Inspector Zone END */}

			<div
				{...useBlockProps({
					className: "relative-block",
				})}
			>
				{attributes.image_url && attributes.image_id ? (
					<>
						<img src={attributes.image_url} className="image-box" />
						<button
							className="button-remove"
							onClick={() => setAttributes({ image_url: "", image_id: null })}
						>
							Remove
						</button>
					</>
				) : (
					<MediaPlaceholder
						onSelect={(image) => {
							setAttributes({ image_url: image.url, image_id: image.id });
						}}
						allowedTypes={["image"]}
						multiple={false}
						className={"image-box"}
						labels={{ title: "CTA Image" }}
					></MediaPlaceholder>
				)}
				<div {...useBlockProps({
					className: `is-position-${attributes.inner_block_position}`,
				})}>
					<InnerBlocks />
				</div>
			</div>
		</>
	);
}
