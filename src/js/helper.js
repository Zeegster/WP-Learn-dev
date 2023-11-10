import domReady from "@wordpress/dom-ready";
domReady(() => {
  const observer = new MutationObserver(() => {
      const coverBlocks = document.querySelectorAll('.wp-block-cover');
      coverBlocks.forEach(block => {
          if (block.querySelector('.wp-block-ulitka-kit-media-text-absolute')) {
              block.style.overflow = 'visible';
          }
      });
  });

  observer.observe(document.body, { childList: true, subtree: true });
});


console.log("Helper is loaded!")