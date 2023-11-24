console.log("Column Block Extension");
import { registerBlockExtension } from "@10up/block-components";
import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import {
	__experimentalUseCustomUnits as useCustomUnits,
	PanelBody,
	__experimentalUnitControl as UnitControl,
} from "@wordpress/components";

const additionalAttributes = {
	isColumnWidthTablet: {
		type: "string",
	},
	isColumnWidthMobile: {
		type: "string",
	},
};

function generateClassNames(attributes) {
	const { isColumnWidthMobile, isColumnWidthTablet } = attributes;
	let className = "";

	if (isColumnWidthMobile) {
		className += ` .is-column-width-mobile-${isColumnWidthMobile}`;
	}
	if (isColumnWidthTablet) {
		className += ` .is-column-width-tablet-${isColumnWidthTablet}`;
	}
	return className.trim();
}

function ColumnBlockEdit(props) {
	const { isColumnWidthMobile, isColumnWidthTablet } = props.attributes;

	const units = useCustomUnits({
		availableUnits: ["%", "px", "em", "rem", "vw"],
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Additional Column settings")}>
					<UnitControl
						label={__("Tablet Width")}
						labelPosition="edge"
						__unstableInputWidth="80px"
						value={isColumnWidthTablet || ""}
						onChange={(nextWidth) => {
							nextWidth = 0 > parseFloat(nextWidth) ? "0" : nextWidth;
							props.setAttributes({ isColumnWidthTablet: nextWidth });
						}}
						units={units}
					/>
					<UnitControl
						label={__("Mobile Width")}
						labelPosition="edge"
						__unstableInputWidth="80px"
						value={isColumnWidthMobile || ""}
						onChange={(nextWidth) => {
							nextWidth = 0 > parseFloat(nextWidth) ? "0" : nextWidth;
							props.setAttributes({ isColumnWidthMobile: nextWidth });
						}}
						units={units}
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
}

registerBlockExtension(
	"core/column", // also supports adding multiple blocks as an array
	{
		extensionName: "column-responsive-width",
		attributes: additionalAttributes,
		classNameGenerator: generateClassNames,
		Edit: ColumnBlockEdit,
		order: "after",
	},
);

