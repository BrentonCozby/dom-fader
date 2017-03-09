// Save the display values of new elements before fading out,
// so that fadeIn will go back to the original display value
let CSSvalues = {}

function fade(element, _speed, direction, easing) {
    // abort fading if is already fading in or out
    if(element.dataset.fading) return false

    element.dataset.fading = true

    const s = element.style
    const savedValues = CSSvalues[element.dataset.domFaderId]
    const thisDisplay = window.getComputedStyle(element).getPropertyValue('display')
    const thisOpacity = window.getComputedStyle(element).getPropertyValue('opacity')
    const speed = (_speed) ? _speed : (_speed === 0) ? 0 : 300

    if(!element.dataset.domFaderId) {
        const id = Math.random()
        element.dataset.domFaderId = id
        CSSvalues[id] = {
            display: thisDisplay === 'none' ? 'block' : thisDisplay,
            opacity: thisOpacity === '0' ? '1' : thisOpacity
        }
    }

    // add/remove the styles that will animate the element
    if(direction === 'in') {
        s.opacity = '0'
        s.display = (savedValues) ? savedValues.display : 'block'
        s.transition = `opacity ${speed}ms ${easing || ''}`
        setTimeout(() => s.opacity = (savedValues) ? savedValues.opacity : '1', 10)
    }
    if(direction === 'out') {
        s.transition = `opacity ${speed}ms ${easing || ''}`
        s.opacity = '0'
    }

    // remove temp styles, add DOM-fader-hidden class, and return the element
    let done = new Promise(function(resolve, reject) {
        setTimeout(function() {
            element.removeAttribute('style')
            element.removeAttribute('data-fading')
            if(direction === 'in') {
                element.classList.remove('DOM-fader-hidden')
                s.display = (savedValues) ? savedValues.display : 'block'
            }
            if(direction === 'out') element.classList.add('DOM-fader-hidden')
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

    Object.prototype.fadeIn = function(_speed, easing) {
        return fade(this, _speed, 'in', easing)
    }

    Object.prototype.fadeOut = function(_speed, easing) {
        return fade(this, _speed, 'out', easing)
    }

    Object.prototype.fadeToggle = function(_speed, easing) {
        if(this.classList.contains('DOM-fader-hidden')) {
            return fade(this, _speed, 'in', easing)
        }
        else {
            return fade(this, _speed, 'out', easing)
        }

    }
})()
