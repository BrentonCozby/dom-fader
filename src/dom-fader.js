// Save the display values of new elements before fading out,
// so that fadeIn will go back to the original display value
let CSSvalues = {}

function fade(element, fadeSpeed, direction, easing) {
    // abort fading if is already fading in or out
    if (element.dataset.fading) {
        return false
    }

    element.dataset.fading = true

    const s = element.style
    const savedValues = CSSvalues[element.dataset.domFaderId]
    const thisDisplay = window.getComputedStyle(element).getPropertyValue('display')
    const thisOpacity = window.getComputedStyle(element).getPropertyValue('opacity')
    const speed = (fadeSpeed) ? fadeSpeed : (fadeSpeed === 0) ? 0 : 300

    if (!element.dataset.domFaderId) {
        const id = (Date.now() * Math.random()).toFixed(0)
        element.dataset.domFaderId = id
        CSSvalues[id] = {
            display: thisDisplay === 'none' ? 'block' : thisDisplay,
            opacity: thisOpacity === '0' ? '1' : thisOpacity
        }
    }

    // add/remove the styles that will animate the element
    if (direction === 'in') {
        s.opacity = '0'
        s.display = (savedValues) ? savedValues.display : 'block'
        s.transition = `opacity ${speed}ms ${easing || ''}`
        setTimeout(() => s.opacity = (savedValues) ? savedValues.opacity : '1', 10)
    }

    if (direction === 'out') {
        s.transition = `opacity ${speed}ms ${easing || ''}`
        s.opacity = '0'
    }

    // remove temp styles, add DOM-fader-hidden class, and return the element
    let done = new Promise((resolve, reject) => {
        setTimeout(() => {
            element.removeAttribute('style')
            element.removeAttribute('data-fading')

            if (direction === 'in') {
                element.classList.remove('DOM-fader-hidden')
                s.display = (savedValues) ? savedValues.display : 'block'
            }

            if (direction === 'out') {
                element.classList.add('DOM-fader-hidden')
            }

            resolve(element)
        }, speed)
    })

    return done
}

(function DOMfaderInit() {
    const sheet = document.createElement('style')
    sheet.id = 'fadeCSSStyles'
    sheet.innerHTML = `
        .DOM-fader-hidden {
            display: none;
        }
    `
    document.head.appendChild(sheet)

    Object.defineProperty(Object.prototype, 'fadeIn', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (fadeSpeed, easing) {
            return fade(this, fadeSpeed, 'in', easing)
        }
    })

    Object.defineProperty(Object.prototype, 'fadeOut', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (fadeSpeed, easing) {
            return fade(this, fadeSpeed, 'out', easing)
        }
    })

    Object.defineProperty(Object.prototype, 'fadeToggle', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (fadeSpeed, easing) {
            if (this.classList.contains('DOM-fader-hidden')) {
                return fade(this, fadeSpeed, 'in', easing)
            } else {
                return fade(this, fadeSpeed, 'out', easing)
            }

        }
    })
})()
