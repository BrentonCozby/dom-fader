"use strict";

(function () {
  'use strict';

  var styleCache = {};
  initDomFader();
  initPrintStyles();

  function initDomFader() {
    var sheet = document.createElement('style');
    sheet.id = 'dom-fader';
    sheet.innerHTML = "\n      .DOM-fader-removed {\n        display: none !important;\n      }\n      .DOM-fader-hidden {\n        visibility: hidden;\n      }\n    ";
    document.head.appendChild(sheet);

    function fadeIn(_ref) {
      var element = _ref.element,
          fadeSpeed = _ref.fadeSpeed,
          easing = _ref.easing,
          delay = _ref.delay,
          preventDisplayNone = _ref.preventDisplayNone,
          visibleDisplayValue = _ref.visibleDisplayValue;
      return fade({
        element: element,
        fadeSpeed: fadeSpeed,
        direction: 'in',
        easing: easing,
        delay: delay,
        preventDisplayNone: preventDisplayNone,
        visibleDisplayValue: visibleDisplayValue
      });
    }

    function fadeOut(_ref2) {
      var element = _ref2.element,
          fadeSpeed = _ref2.fadeSpeed,
          easing = _ref2.easing,
          delay = _ref2.delay,
          preventDisplayNone = _ref2.preventDisplayNone;
      return fade({
        element: element,
        fadeSpeed: fadeSpeed,
        direction: 'out',
        easing: easing,
        delay: delay,
        preventDisplayNone: preventDisplayNone
      });
    }

    function fadeToggle(_ref3) {
      var element = _ref3.element,
          fadeSpeed = _ref3.fadeSpeed,
          easing = _ref3.easing,
          delay = _ref3.delay,
          preventDisplayNone = _ref3.preventDisplayNone,
          visibleDisplayValue = _ref3.visibleDisplayValue;
      return fade({
        element: element,
        fadeSpeed: fadeSpeed,
        easing: easing,
        delay: delay,
        preventDisplayNone: preventDisplayNone,
        visibleDisplayValue: visibleDisplayValue
      });
    }

    window.domFader = {
      fadeIn: fadeIn,
      fadeOut: fadeOut,
      fadeToggle: fadeToggle
    };
  }

  function fade(_ref4) {
    var element = _ref4.element,
        fadeSpeed = _ref4.fadeSpeed,
        direction = _ref4.direction,
        easing = _ref4.easing,
        _ref4$delay = _ref4.delay,
        delay = _ref4$delay === void 0 ? 0 : _ref4$delay,
        preventDisplayNone = _ref4.preventDisplayNone,
        _ref4$visibleDisplayV = _ref4.visibleDisplayValue,
        visibleDisplayValue = _ref4$visibleDisplayV === void 0 ? 'block' : _ref4$visibleDisplayV;
    var domFaderId = element.dataset.domFaderId || (Date.now() * Math.random()).toFixed(0);

    if (!element.dataset.domFaderId) {
      element.dataset.domFaderId = domFaderId;
    }

    if (!styleCache[domFaderId]) {
      styleCache[domFaderId] = {};
    }

    var cachedStyle = styleCache[domFaderId];
    var computedStyle = window.getComputedStyle(element);
    var currentDisplay = computedStyle.getPropertyValue('display');
    var currentOpacity = computedStyle.getPropertyValue('opacity');
    var fadeDirection = direction || (currentDisplay === 'none' || element.classList.contains('DOM-fader-removed', 'DOM-fader-hidden') ? 'in' : 'out');
    var speed = fadeSpeed ? fadeSpeed : fadeSpeed === 0 ? 0 : 300;

    if (element.dataset.fading) {
      return Promise.resolve(element);
    }

    if (fadeDirection === 'in' && currentDisplay !== 'none' && !element.classList.contains('DOM-fader-hidden')) {
      return Promise.resolve(element);
    }

    if (fadeDirection === 'out' && element.classList.contains('DOM-fader-removed', 'DOM-fader-hidden')) {
      return Promise.resolve(element);
    }

    element.dataset.fading = true;
    element.style.transition = "all ".concat(speed, "ms ").concat(easing || '');

    if (fadeDirection === 'in') {
      element.style.opacity = '0';
      element.classList.remove('DOM-fader-removed', 'DOM-fader-hidden');
    }

    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        // trigger the animation
        if (fadeDirection === 'in') {
          element.style.display = cachedStyle.display ? cachedStyle.display : visibleDisplayValue;
          element.style.opacity = cachedStyle.opacity ? cachedStyle.opacity : '1';
        }

        if (fadeDirection === 'out') {
          element.style.opacity = '0';
        }

        resolve();
      }, delay ? +delay : 0);
    }).then(function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          if (fadeDirection === 'out') {
            element.classList.add(preventDisplayNone ? 'DOM-fader-hidden' : 'DOM-fader-removed');
          }

          element.style.removeProperty('display');
          element.style.removeProperty('transition');
          element.style.removeProperty('opacity');
          element.removeAttribute('data-fading');
          styleCache[domFaderId].display = currentDisplay !== 'none' ? currentDisplay : visibleDisplayValue;
          styleCache[domFaderId].opacity = currentOpacity === '0' ? '1' : currentOpacity;
          resolve(element);
        }, speed);
      });
    });
  }

  function initPrintStyles() {
    var hiddenElements;
    var hiddenStatusCache = {};

    function showContent() {
      hiddenElements = document.querySelectorAll('DOM-fader-removed', '.DOM-fader-hidden');
      hiddenElements.forEach(function (element) {
        element.classList.remove('DOM-fader-removed', 'DOM-fader-hidden');
        hiddenStatusCache[element.dataset.domFaderId] = element.dataset.classList.value;
      });
    }

    function hideContent() {
      hiddenElements.forEach(function (element) {
        element.classList.add(hiddenStatusCache[element.dataset.domFaderId].split(' '));
      });
    }

    window.onbeforeprint = showContent;
    window.onafterprint = hideContent;
    var mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener(function (mql) {
      if (mql.matches) {
        showContent();
        setTimeout(hideContent, 500);
      }
    });
  }
})();
