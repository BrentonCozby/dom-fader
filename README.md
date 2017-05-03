# dom-fader
It works like jQuery's fadeToggle(), fadeIn(), &amp; fadeOut().
Uses CSS3 transitions to animate the opacity. Saves the original display value, such as 'inline' or 'block'.


[**dom-slider**](https://github.com/BrentonCozby/dom-slider) is a thing too.

### Features:
* Fading-out will save the original display value, such as 'inline-block', and fading-in will set the display back to the original value of 'inline-block' or whatever value it originally had
* May fade multiple elements at once
* Returns a Promise resolved with the element. Allows method-chaining
* Zero Dependencies and written in plain JavaScript (compiled to ES5)

### Example Usage:
First, place the dom-fader.js file in your code somewhere. Then do stuff like below:
```JavaScript
import 'dom-fader' // if using ES6 modules

const box = document.querySelector('.box')

box.fadeToggle()

box.fadeOut(1200)

box.fadeIn(800, 'easeOut')

box.fadeIn(500).then(box => box.fadeOut(300))
```
### Install:
```
bower install dom-fader --save

npm install dom-fader --save
```
or include a script tag with the file served from a CDN:
```HTML
<script src="https://cdn.rawgit.com/BrentonCozby/dom-fader/006cbd6b/dist/dom-fader.js"></script>
```


### Options:
No arguments required, but you may give 1 or 2 arguments to fadeToggle, fadeIn, and fadeOut:
```JavaScript
fadeIn(speedInMilliseconds, CSSTransitionTimingFunction)
```
