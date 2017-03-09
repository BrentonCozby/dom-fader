'use strict';

// Save the display values of new elements before fading out,
// so that fadeIn will go back to the original display value
var CSSvalues = {};

function fade(element, _speed, direction, easing) {
    // abort fading if is already fading in or out
    if (element.dataset.fading) return false;

    element.dataset.fading = true;

    var s = element.style;
    var thisDisplay = window.getComputedStyle(element).getPropertyValue('display');
    var thisOpacity = window.getComputedStyle(element).getPropertyValue('opacity');
    var speed = _speed ? _speed : _speed === 0 ? 0 : 300;

    // add/remove the styles that will animate the element
    if (direction === 'in') {
        s.opacity = '0';
        s.display = CSSvalues[element.dataset.domFaderId].display || 'block';
        s.transition = 'opacity ' + speed + 'ms ' + (easing || '');
        setTimeout(function () {
            return s.opacity = CSSvalues[element.dataset.domFaderId].opacity || '1';
        }, 10);
    }
    if (direction === 'out') {
        s.transition = 'opacity ' + speed + 'ms ' + (easing || '');
        s.opacity = '0';
        if (!element.dataset.domFaderId) {
            var id = Math.random();
            element.dataset.domFaderId = id;
            CSSvalues[id] = {
                display: thisDisplay,
                opacity: thisOpacity
            };
        }
    }

    // remove temp styles, add DOM-fader-hidden class, and return the element
    var done = new Promise(function (resolve, reject) {
        setTimeout(function () {
            element.removeAttribute('style');
            element.removeAttribute('data-fading');
            if (direction === 'in') {
                element.classList.remove('DOM-fader-hidden');
                s.display = CSSvalues[element.dataset.domFaderId].display || 'block';
            }
            if (direction === 'out') element.classList.add('DOM-fader-hidden');
            resolve(element);
        }, speed);
    });

    return done;
}

(function DOMfaderInit() {
    var sheet = document.createElement('style');
    sheet.id = 'fadeCSSStyles';
    sheet.innerHTML = '\n        .DOM-fader-hidden {\n            display: none;\n        }\n    ';
    document.head.appendChild(sheet);

    Object.prototype.fadeIn = function (_speed, easing) {
        return fade(this, _speed, 'in', easing);
    };

    Object.prototype.fadeOut = function (_speed, easing) {
        return fade(this, _speed, 'out', easing);
    };

    Object.prototype.fadeToggle = function (_speed, easing) {
        if (this.classList.contains('DOM-fader-hidden')) {
            return fade(this, _speed, 'in', easing);
        } else {
            return fade(this, _speed, 'out', easing);
        }
    };
})();
