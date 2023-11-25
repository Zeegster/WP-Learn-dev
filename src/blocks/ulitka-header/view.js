/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 *
 * When this file is defined as the value of the `viewScript` property
 * in `block.json` it will be enqueued on the front end of the site.
 *
 * Example:
 *
 * ```js
 * {
 *   "viewScript": "file:./view.js"
 * }
 * ```
 *
 * If you're not making any changes to this file because your project doesn't need any
 * JavaScript running in the front-end, then you should delete this file and remove
 * the `viewScript` property from `block.json`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#view-script
 */

/* eslint-disable no-console */
import domReady from '@wordpress/dom-ready';

/* eslint-disable no-console */

domReady( () => {
	// Получаем элементы / Get elements
	const outerWrapper = document.querySelector( '.navigation-outer-wrapper' );
	const toggleWrapper = document.querySelector(
		'.navigation-button-wrapper'
	);
	const navToggle = document.querySelector( '.navigation-button' );
	const buttonImage = document.querySelector( '.button-image' );
	const navWrapper = document.querySelector( '.navigation-wrapper' );

	// Получаем исходные стили кнопки / Get original button styles
	const {
		backgroundColor: originalButtonColor,
		backdropFilter: originalBackdropFilter,
	} = getComputedStyle( navToggle );

	// Получаем исходные стили обертки / Get original wrapper styles
	const {
		backgroundColor: wrapperBgColor,
		backdropFilter: wrapperBackdropFilter,
	} = getComputedStyle( navWrapper );

	// Флаг для отслеживания текущего стиля / Flag to track the current style
	let isOriginalStyle = true;

	// Переменная для хранения последнего значения прокрутки / Variable to store the last scroll value
	let lastScroll = 0;

	// Функция для проверки состояния кнопки при прокрутке / Function to check the button state on scroll
	function checkButtonOnScroll() {
		if (
			navToggle.classList.contains( 'active' ) &&
			buttonImage.classList.contains( 'hidden' ) &&
			toggleWrapper.classList.contains( 'under-nav-wrapper' )
		) {
			navToggle.classList.remove( 'active' );
			buttonImage.classList.remove( 'hidden' );
			toggleWrapper.classList.remove( 'under-nav-wrapper' );

			if ( ! isOriginalStyle && window.innerWidth >= 1024 ) {
				Object.assign( navToggle.style, {
					backgroundColor: originalButtonColor,
					backdropFilter: originalBackdropFilter,
				} );
				isOriginalStyle = true;
			}
		}
	}

	// Функция для сброса навигации до ее исходного состояния / Function to reset the navigation to its default state
	function resetNavigation() {
		navToggle.classList.remove( 'active' );
		buttonImage.classList.remove( 'hidden' );
		toggleWrapper.classList.remove( 'under-nav-wrapper' );
		toggleWrapper.classList.remove( 'on-scroll' );
		document.body.classList.remove( 'no-scroll' );

		Object.assign( navToggle.style, {
			backgroundColor: originalButtonColor,
			backdropFilter: originalBackdropFilter,
		} );
		isOriginalStyle = true;
	}

	// Обработчик клика по кнопке / Click handler for the button
	function handleClick() {
		// Переключаем классы / Toggle classes
		navToggle.classList.toggle( 'active' );
		outerWrapper.classList.toggle( 'open' );
		outerWrapper.classList.contains( 'open' )
			? navWrapper.classList.remove( 'animated' )
			: navWrapper.classList.add( 'animated' );

		if ( window.innerWidth <= 1023 ) {
			document.body.classList.toggle( 'no-scroll' );
		}

		if ( window.innerWidth >= 1024 ) {
			toggleWrapper.classList.toggle( 'under-nav-wrapper' );
			buttonImage.classList.toggle( 'hidden' );

			// Переключаем класс "animated" в зависимости от состояния navWrapper / Toggle "animated" class depending on the state of navWrapper

			// Меняем текущий стиль кнопки на стили обертки, если исходный стиль не менялся / Change the current button style to wrapper styles if the original style has not changed
			Object.assign( navToggle.style, {
				backgroundColor: isOriginalStyle
					? wrapperBgColor
					: originalButtonColor,
				backdropFilter: isOriginalStyle
					? wrapperBackdropFilter
					: originalBackdropFilter,
			} );

			// Переключаем флаг / Toggle the flag
			isOriginalStyle = ! isOriginalStyle;
		}
	}

	// Функция для обработки прокрутки / Function to handle scrolling
	function handleScroll() {
		let scroll = window.scrollY;
		// Проверяем, прокручивает ли пользователь страницу вверх / Check if the user is scrolling up
		let isScrollingUp = lastScroll > scroll;

		// Если прокрутка изменилась более чем на 200 пикселей / If the scroll has changed by more than 200 pixels
		if ( Math.abs( lastScroll - scroll ) >= 200 ) {
			// Если прокрутка больше или равна 100 / If the scroll is greater than or equal to 100
			if ( scroll >= 100 ) {
				outerWrapper.classList.remove( 'open' );
				navWrapper.classList.add( 'animated' );
				toggleWrapper.classList.add( 'on-scroll' );
				checkButtonOnScroll();
			} else if ( scroll <= 100 ) {
				// Если прокрутка меньше или равна 100 / If the scroll is less than or equal to 100
				outerWrapper.classList.add( 'open' );
				// Добавляем класс 'animated' только при прокрутке вверх / Add 'animated' class only when scrolling up
				if ( isScrollingUp ) {
					navWrapper.classList.remove( 'animated' );
				}
				toggleWrapper.classList.remove( 'on-scroll' );
				checkButtonOnScroll();
			}
			lastScroll = scroll;
		}
		// Если прокрутка меньше или равна 10 / If the scroll is less than or equal to 10
		if ( scroll <= 10 ) {
			outerWrapper.classList.add( 'open' );
			// Добавляем класс 'animated' только при прокрутке вверх / Add 'animated' class only when scrolling up
			if ( isScrollingUp ) {
				navWrapper.classList.remove( 'animated' );
			}
			toggleWrapper.classList.remove( 'on-scroll' );
			checkButtonOnScroll();
		}
	}
	function handleViewChange() {
		const mobileView = window.matchMedia( '(max-width: 1023px)' );
		const desktopView = window.matchMedia( '(min-width: 1024px)' );

		function handleResize() {
			if ( mobileView.matches ) {
				// Добавляем обработчики событий для мобильного вида
				navToggle.addEventListener( 'touchstart', handleClick, {
					passive: true,
				} );
				// Удаляем обработчики событий для десктопного вида
				navToggle.removeEventListener( 'click', handleClick );
				window.removeEventListener( 'scroll', handleScroll );
				outerWrapper.classList.remove( 'open' );
			} else if ( desktopView.matches ) {
				// Добавляем обработчики событий для десктопного вида

				outerWrapper.classList.add( 'open' );
				navToggle.addEventListener( 'click', handleClick );
				window.addEventListener( 'scroll', handleScroll );
				// Удаляем обработчики событий для мобильного вида
				navToggle.removeEventListener( 'touchstart', handleClick, {
					passive: true,
				} );
			}
			resetNavigation(); // Сброс навигации при изменении размера окна
		}

		// Проверка при загрузке страницы и при изменении размера окна
		handleResize();
		window.addEventListener( 'resize', handleResize );
	}

	handleViewChange();
} );
/* eslint-enable no-console */
