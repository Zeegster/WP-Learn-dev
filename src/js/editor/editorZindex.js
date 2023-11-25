import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { InspectorControls } from '@wordpress/blockEditor';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';

// 1. Add a z-index attribute and a toggle to all blocks.
addFilter(
	'blocks.registerBlockType',
	'ulitka-kit/add-z-index-attribute',
	( settings, name ) => {
		if ( ! settings.attributes ) {
			settings.attributes = {};
		}
		settings.attributes.zIndex = {
			type: 'number',
			default: 0,
		};
		settings.attributes.toggleZIndex = {
			type: 'boolean',
			default: false,
		};
		return settings;
	}
);

// 2. Add a control to the block editor for changing the z-index attribute.
const withZindexControl = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const { zIndex, toggleZIndex } = props.attributes;
		const onChangeZindex = ( value ) => {
			props.setAttributes( { zIndex: value } );
		};
		const onToggleZIndex = ( value ) => {
			props.setAttributes( { toggleZIndex: value } );
		};

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls>
					<PanelBody
						title={ __( 'Z-index', 'ulitka-kit' ) }
						initialOpen={ toggleZIndex }
					>
						<ToggleControl
							label={ __( 'Включить z-index', 'ulitka-kit' ) }
							checked={ toggleZIndex }
							onChange={ onToggleZIndex }
						/>

						{ toggleZIndex && (
							<RangeControl
								value={ zIndex }
								onChange={ onChangeZindex }
								min={ 0 }
								max={ 100 }
							/>
						) }
						<p>
							{ __(
								'Настройте z-index блока. Z-index определяет порядок слоев элемента. Элемент с большим порядком слоев всегда находится перед элементом с меньшим порядком слоев.',
								'ulitka-kit'
							) }
						</p>
					</PanelBody>
				</InspectorControls>
			</>
		);
	};
}, 'withZindexControl' );

addFilter(
	'editor.BlockEdit',
	'ulitka-kit/with-z-index-control',
	withZindexControl
);

// 3. Add the z-index style to the block's wrapper in the editor.
const addZindexStyle = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const { zIndex, toggleZIndex } = props.attributes;
		let wrapperProps = props.wrapperProps ? props.wrapperProps : {};

		if ( toggleZIndex && zIndex ) {
			wrapperProps = {
				...wrapperProps,
				style: {
					...wrapperProps.style,
					zIndex: zIndex,
				},
			};
		}

		return <BlockListBlock { ...props } wrapperProps={ wrapperProps } />;
	};
}, 'addZindexStyle' );

addFilter(
	'editor.BlockListBlock',
	'ulitka-kit/add-z-index-style',
	addZindexStyle
);

// 4. Add the z-index style to the block's saved markup.
addFilter(
	'blocks.getSaveContent.extraProps',
	'ulitka-kit/add-z-index-extra-props',
	( extraProps, blockType, attributes ) => {
		if ( attributes.toggleZIndex && attributes.zIndex ) {
			let position = 'relative';
			if (
				extraProps.style &&
				extraProps.style.position &&
				extraProps.style.position !== 'static'
			) {
				position = extraProps.style.position;
			}
			extraProps.style = {
				...( extraProps.style || {} ),
				zIndex: attributes.zIndex,
				position: position,
			};
		}
		return extraProps;
	}
);
console.log( 'editorZindex.js is running' );
