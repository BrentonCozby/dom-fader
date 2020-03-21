# dom-fader
[![Known Vulnerabilities](https://snyk.io/test/github/brentoncozby/dom-fader/badge.svg?targetFile=package.json)](https://snyk.io/test/github/brentoncozby/dom-fader?targetFile=package.json)

It works like jQuery's fadeToggle(), fadeIn(), &amp; fadeOut().
Uses CSS3 transitions to animate the opacity. Saves the original display value, such as 'inline' or 'block'.

[**dom-slider**](https://github.com/BrentonCozby/dom-slider) is a thing too.

### Features:
* Fading-out will save the original display value, such as 'inline-block', and fading-in will set the display back to the original value of 'inline-block' or whatever value it originally had
* You can fade multiple elements at once
* Returns a Promise resolved with the element
* Zero Dependencies and written in plain JavaScript (compiled to ES5)

### Example Usage:
[dom-fader CDN link](https://rawcdn.githack.com/BrentonCozby/dom-fader/819f5d67d6461909a742cb0f85aa6f25780bfdd3/dist/dom-fader.js)

First, place the dom-fader CDN link in your html file above your own JavaScript files. Hide all the elements that you want to fade in/toggle using display: none in CSS. Then do stuff like below:
```JavaScript
const {fadeIn, fadeOut, fadeToggle} = window.domFader

const box = document.querySelector('.box')

fadeToggle({element: box})

fadeOut({element: box, fadeSpeed: 1200})

fadeIn({element: box, fadeSpeed: 800, easing: 'easeOut'})

fadeIn({element: box, fadeSpeed: 500}).then(box => fadeOut({element: box, fadeSpeed: 300}))
```

### Options:
No arguments required, but you may give 1 or 2 arguments to fadeToggle, fadeIn, and fadeOut:
```JavaScript
fadeIn({
  element,
  fadeSpeed,
  direction,
  easing,
  delay = 0,
  preventDisplayNone,
  visibleDisplayValue = 'block'
})
```
