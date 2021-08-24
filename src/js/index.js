import Glide from '@glidejs/glide';
import './../scss/index.scss';

// Next.js
// Nuxt.js

document.addEventListener('DOMContentLoaded', () => {
  const glideInstance = new Glide('.glide', {
    type: 'carousel',
  });

  glideInstance.mount();
});

/**
 * const name = 'test';
 * {
 *  Controls: Controls,
 *  name,
 * }
 */
