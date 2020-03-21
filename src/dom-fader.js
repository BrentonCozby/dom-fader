(function () {
  'use strict';

  let styleCache = {}

  initDomFader()
  initPrintStyles()

  function initDomFader() {
    const sheet = document.createElement('style')
    sheet.id = 'dom-fader'
    sheet.innerHTML = `
      .DOM-fader-removed {
        display: none !important;
      }
      .DOM-fader-hidden {
        visibility: hidden;
      }
    `
    document.head.appendChild(sheet)

    function fadeIn({element, fadeSpeed, easing, delay, preventDisplayNone, visibleDisplayValue}) {
      return fade({
        element,
        fadeSpeed,
        direction: 'in',
        easing,
        delay,
        preventDisplayNone,
        visibleDisplayValue
      })
    }

    function fadeOut({element, fadeSpeed, easing, delay, preventDisplayNone}) {
      return fade({
        element,
        fadeSpeed,
        direction: 'out',
        easing,
        delay,
        preventDisplayNone
      })
    }

    function fadeToggle({element, fadeSpeed, easing, delay, preventDisplayNone, visibleDisplayValue}) {
      return fade({
        element,
        fadeSpeed,
        easing,
        delay,
        preventDisplayNone,
        visibleDisplayValue
      })
    }

    window.domFader = {
      fadeIn,
      fadeOut,
      fadeToggle
    }
  }

  function fade({
    element,
    fadeSpeed,
    direction,
    easing,
    delay = 0,
    preventDisplayNone,
    visibleDisplayValue = 'block'
  }) {
    const domFaderId = element.dataset.domFaderId || (Date.now() * Math.random()).toFixed(0)

    if (!element.dataset.domFaderId) {
      element.dataset.domFaderId = domFaderId
    }

    if (!styleCache[domFaderId]) {
      styleCache[domFaderId] = {}
    }

    const cachedStyle = styleCache[domFaderId]
    const computedStyle = window.getComputedStyle(element)
    const currentDisplay = computedStyle.getPropertyValue('display')
    const currentOpacity = computedStyle.getPropertyValue('opacity')
    const fadeDirection = direction || (currentDisplay === 'none' || element.classList.contains('DOM-fader-removed', 'DOM-fader-hidden') ? 'in' : 'out')
    const speed = fadeSpeed ? fadeSpeed : (fadeSpeed === 0) ? 0 : 300

    if (element.dataset.fading) {
      return Promise.resolve(element)
    }

    if (fadeDirection === 'in' && currentDisplay !== 'none' && !element.classList.contains('DOM-fader-hidden')) {
      return Promise.resolve(element)
    }

    if (fadeDirection === 'out' && element.classList.contains('DOM-fader-removed', 'DOM-fader-hidden')) {
      return Promise.resolve(element)
    }

    element.dataset.fading = true
    element.style.transition = `all ${speed}ms ${easing || ''}`
    
    if (fadeDirection === 'in') {
      element.style.opacity = '0'
      element.classList.remove('DOM-fader-removed', 'DOM-fader-hidden')
    }

    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        // trigger the animation
        if (fadeDirection === 'in') {
          element.style.display = cachedStyle.display ? cachedStyle.display : visibleDisplayValue
          element.style.opacity = cachedStyle.opacity ? cachedStyle.opacity : '1'
        }

        if (fadeDirection === 'out') {
          element.style.opacity = '0'
        }
        
        resolve()
      }, delay ? +delay : 0)
    })
    .then(function () {
      return new Promise(function (resolve, reject) {
        setTimeout(function () {
          if (fadeDirection === 'out') {
            element.classList.add(preventDisplayNone ? 'DOM-fader-hidden' : 'DOM-fader-removed')
          }

          element.style.removeProperty('display')
          element.style.removeProperty('transition')
          element.style.removeProperty('opacity')
          element.removeAttribute('data-fading')

          styleCache[domFaderId].display = currentDisplay !== 'none' ? currentDisplay : visibleDisplayValue
          styleCache[domFaderId].opacity = currentOpacity === '0' ? '1' : currentOpacity

          resolve(element)
        }, speed)
      })
    })
  }

  function initPrintStyles() {
    let hiddenElements

    const hiddenStatusCache = {}

    function showContent() {
      hiddenElements = document.querySelectorAll('DOM-fader-removed', '.DOM-fader-hidden')
      hiddenElements.forEach(element => {
        element.classList.remove('DOM-fader-removed', 'DOM-fader-hidden')
        hiddenStatusCache[element.dataset.domFaderId] = element.dataset.classList.value
      })
    }

    function hideContent() {
      hiddenElements.forEach(element => {
        element.classList.add(hiddenStatusCache[element.dataset.domFaderId].split(' '))
      })
    }

    window.onbeforeprint = showContent
    window.onafterprint = hideContent

    const mediaQueryList = window.matchMedia('print')
    mediaQueryList.addListener(function (mql) {
      if (mql.matches) {
          showContent()
          setTimeout(hideContent, 500)
      }
    })
  }
})()
