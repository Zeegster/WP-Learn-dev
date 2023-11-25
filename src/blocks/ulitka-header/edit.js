/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
/**
 * Allows to use block controls.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-block-editor/
 */
import {
	InspectorControls,
	PanelColorSettings,
	MediaUpload,
	useBlockProps,
	InnerBlocks,
	MediaUploadCheck,
} from '@wordpress/block-editor';

/**
 * WordPress components
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-components/
 */
import {
	Button,
	RangeControl,
	PanelBody,
	PanelHeader,
} from '@wordpress/components';

import { useState, useEffect } from '@wordpress/element';
/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		containerColor,
		buttonColor,
		burgerColor,
		buttonImage,
		buttonImageID,
		backgroundBlur,
	} = attributes;
	const blockProps = useBlockProps( {
		className: 'navigation-wrapper',
		style: {
			backgroundColor: containerColor,
			backdropFilter: `blur(${ backgroundBlur }px)`,
		},
	} );
	// Function to handle image selection
	const onSelectImage = ( image ) => {
		setAttributes( { buttonImage: image.url, buttonImageID: image.id } );
	};
	const [ isActive, setIsActive ] = useState( false );
	const [ isHidden, setIsHidden ] = useState( false );

	useEffect( () => {
		const handleClick = () => {
			setIsActive( ! isActive );
			setIsHidden( ! isHidden );
		};

		const navButton = document.querySelector( '.navigation-button' );
		if ( navButton ) {
			navButton.addEventListener( 'click', handleClick );
		}

		return () => {
			if ( navButton ) {
				navButton.removeEventListener( 'click', handleClick );
			}
		};
	}, [] );

	return (
		<>
			{ /* Block Controls */ }
			<InspectorControls>
				<PanelHeader label={ __( 'Настройки блока', 'ulitka-kit' ) } />
				<PanelColorSettings
					title={ __( 'Цвета', 'ulitka-kit' ) }
					colorSettings={ [
						{
							value: containerColor,
							onChange: ( newColor ) =>
								setAttributes( { containerColor: newColor } ),
							label: __( 'Цвет контейнера', 'ulitka-kit' ),
							enableAlpha: 'true',
						},
						{
							value: buttonColor,
							onChange: ( newColor ) =>
								setAttributes( { buttonColor: newColor } ),
							label: __( 'Цвет кнопки', 'ulitka-kit' ),
						},
						{
							value: burgerColor,
							onChange: ( newColor ) =>
								setAttributes( { burgerColor: newColor } ),
							label: __( 'Цвет полосок бургера', 'ulitka-kit' ),
						},
					] }
				/>
				<PanelBody
					title={ __(
						'Дизайн кнопки и добавление изображения',
						'ulitka-kit'
					) }
				>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectImage }
							allowedTypes={ [ 'image' ] }
							value={ buttonImageID }
							render={ ( { open } ) => (
								<>
									<div
										style={ {
											display: 'grid',
											height: '100px',
										} }
									>
										<div
											className="navigation-button-wrapper"
											style={ { placeSelf: 'center' } }
										>
											<Button
												className={ `navigation-button ${
													isActive ? 'active' : ''
												}` }
												onClick={ () => {
													setIsActive( ! isActive );
													setIsHidden( ! isHidden );
												} }
												style={ {
													backgroundColor:
														buttonColor,
												} }
											>
												<span
													className="burger-line"
													style={ {
														backgroundColor:
															burgerColor,
													} }
												></span>
												<span
													className="burger-line"
													style={ {
														backgroundColor:
															burgerColor,
													} }
												></span>
												<span
													className="burger-line"
													style={ {
														backgroundColor:
															burgerColor,
													} }
												></span>
											</Button>
											<img
												src={ buttonImage }
												alt={ '' }
												className={ `button-image ${
													isHidden ? 'hidden' : ''
												}` }
											/>
										</div>
									</div>
									<Button
										onClick={ open }
										style={ {
											color: '#fff',
											backgroundColor: '#0073aa',
											border: 'none',
											borderRadius: '4px',
											padding: '10px 15px',
											fontSize: '14px',
											cursor: 'pointer',
											marginBottom: '8px',
										} }
									>
										{ buttonImage
											? __(
													'Изменить изображение',
													'ulitka-kit'
											  )
											: __(
													'Выбрать изображение',
													'ulitka-kit'
											  ) }
									</Button>
									{ buttonImage && (
										<>
											<Button
												onClick={ () =>
													setAttributes( {
														buttonImage: null,
														buttonImageID: null,
													} )
												}
												style={ {
													color: '#fff',
													backgroundColor: '#dc3232',
													border: 'none',
													borderRadius: '4px',
													padding: '10px 15px',
													fontSize: '14px',
													cursor: 'pointer',
													marginBottom: '8px',
												} }
											>
												{ __(
													'Удалить изображение',
													'ulitka-kit'
												) }
											</Button>
										</>
									) }
								</>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>
				<PanelBody title={ __( 'Размытие фона', 'ulitka-kit' ) }>
					<RangeControl
						value={ backgroundBlur }
						onChange={ ( value ) =>
							setAttributes( { backgroundBlur: value } )
						}
						min={ 0 }
						max={ 10 }
					/>
				</PanelBody>
			</InspectorControls>

			{ /* Block Markup */ }
			<div { ...blockProps }>
				<InnerBlocks />
			</div>
		</>
	);
}
