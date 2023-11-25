import domReady from '@wordpress/dom-ready';

console.log( 'Helper is loaded!' );

function updateFlexBasis() {
	const columnBlocks = document.querySelectorAll( '.wp-block-column' );

	columnBlocks.forEach( ( block ) => {
		const classList = block.className.split( /\s+/ );
		let isColumnWidthMobile, isColumnWidthTablet;

		const originalFlexBasis = block.style.flexBasis;

		classList.forEach( ( className ) => {
			const mobileMatch = className.match(
				/is-column-width-mobile-(\S+)/
			);
			const tabletMatch = className.match(
				/is-column-width-tablet-(\S+)/
			);

			if ( mobileMatch ) {
				isColumnWidthMobile = mobileMatch[ 1 ];
			}

			if ( tabletMatch ) {
				isColumnWidthTablet = tabletMatch[ 1 ];
			}
		} );

		if ( isColumnWidthMobile || isColumnWidthTablet ) {
			if ( window.innerWidth <= 475 && isColumnWidthMobile ) {
				block.style.flexBasis = isColumnWidthMobile;
			} else if ( window.innerWidth <= 1023 && isColumnWidthTablet ) {
				block.style.flexBasis = isColumnWidthTablet;
			} else {
				block.style.flexBasis = originalFlexBasis;
			}
		}
	} );
}

document.addEventListener( 'DOMContentLoaded', updateFlexBasis );
window.addEventListener( 'resize', updateFlexBasis );

document.addEventListener( 'DOMContentLoaded', () => {
	const swiperEl = document.getElementsByClassName( 'js-carousel-layout' );
	for ( let i = 0; i < swiperEl.length; i++ ) {
		const attributes = swiperEl[ i ].attributes;
		for ( let j = 0; j < attributes.length; j++ ) {
			const attribute = attributes[ j ];
			if ( attribute.name == 'data-carousel-settings' ) {
				let carouselSettings = JSON.parse( attribute.value );
				// Modify the object
				carouselSettings = Object.assign( {}, carouselSettings, {
					loop: true,
					loopAddBlankSlides: true,
					breakpoints: {
						...( carouselSettings.breakpoints || {} ), // Spread existing breakpoints
						640: {
							slidesPerView: 2,
						},
					},
				} );
				// Convert the object back to a JSON string
				const newCarouselSettings = JSON.stringify( carouselSettings );
				// Set the attribute with the modified object
				swiperEl[ i ].setAttribute(
					'data-carousel-settings',
					newCarouselSettings
				);
				console.log( carouselSettings );
			}
		}
	}
} );
