import { gsap } from 'gsap';

/**
 * Animation utility functions using GSAP
 * This file contains reusable animations that can be used throughout the application
 */

// Fade in animation
export const fadeIn = (element, duration = 0.5, delay = 0) => {
  return gsap.from(element, {
    opacity: 0,
    duration,
    delay,
    ease: 'power2.out'
  });
};

// Fade in from bottom animation
export const fadeInUp = (element, duration = 0.5, delay = 0, y = 50) => {
  return gsap.from(element, {
    opacity: 0,
    y,
    duration,
    delay,
    ease: 'power2.out'
  });
};

// Fade in from left animation
export const fadeInLeft = (element, duration = 0.5, delay = 0, x = 50) => {
  return gsap.from(element, {
    opacity: 0,
    x,
    duration,
    delay,
    ease: 'power2.out'
  });
};

// Fade in from right animation
export const fadeInRight = (element, duration = 0.5, delay = 0, x = -50) => {
  return gsap.from(element, {
    opacity: 0,
    x,
    duration,
    delay,
    ease: 'power2.out'
  });
};

// Scale animation
export const scaleIn = (element, duration = 0.5, delay = 0) => {
  return gsap.from(element, {
    scale: 0.8,
    opacity: 0,
    duration,
    delay,
    ease: 'back.out(1.7)'
  });
};

// Stagger animation for lists
export const staggerFadeInUp = (elements, duration = 0.5, stagger = 0.1, y = 20) => {
  return gsap.from(elements, {
    opacity: 0,
    y,
    duration,
    stagger,
    ease: 'power2.out'
  });
};

// Button hover animation
export const buttonHover = (element) => {
  const tl = gsap.timeline({ paused: true });
  tl.to(element, {
    scale: 1.05,
    duration: 0.2,
    ease: 'power1.out'
  });
  return tl;
};

// Number counter animation
export const animateNumber = (element, endValue, duration = 1, delay = 0) => {
  return gsap.to(element, {
    innerText: endValue,
    duration,
    delay,
    ease: 'power1.inOut',
    snap: { innerText: 1 },
    onUpdate: function() {
      // Format with commas if needed
      if (element.innerText.length > 3) {
        element.innerText = parseInt(element.innerText).toLocaleString();
      }
    }
  });
};

// Page transition animation
export const pageTransition = (container) => {
  const tl = gsap.timeline();
  tl.from(container, {
    opacity: 0,
    y: 20,
    duration: 0.4,
    ease: 'power2.out'
  });
  return tl;
};

// Form field animation
export const formFieldAnimation = (elements, stagger = 0.1) => {
  return gsap.from(elements, {
    opacity: 0,
    y: 20,
    duration: 0.5,
    stagger,
    ease: 'power2.out'
  });
};

// Success animation
export const successAnimation = (element) => {
  const tl = gsap.timeline();
  tl.to(element, {
    scale: 1.1,
    backgroundColor: '#4ade80', // Green color
    color: 'white',
    duration: 0.3,
    ease: 'power2.out'
  })
  .to(element, {
    scale: 1,
    duration: 0.2,
    ease: 'power2.in'
  });
  return tl;
};

// Error animation
export const errorAnimation = (element) => {
  const tl = gsap.timeline();
  tl.to(element, {
    x: -10,
    duration: 0.1,
    ease: 'power2.out'
  })
  .to(element, {
    x: 10,
    duration: 0.1,
    ease: 'power2.out'
  })
  .to(element, {
    x: -5,
    duration: 0.1,
    ease: 'power2.out'
  })
  .to(element, {
    x: 5,
    duration: 0.1,
    ease: 'power2.out'
  })
  .to(element, {
    x: 0,
    duration: 0.1,
    ease: 'power2.out'
  });
  return tl;
};
