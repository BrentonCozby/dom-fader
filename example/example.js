const {fadeIn, fadeOut, fadeToggle} = window.domFader

const boxes = document.querySelectorAll('.box')
const content = document.querySelector('.content')
const paragraphs = document.querySelectorAll('.content p')

const fadeInButton = document.querySelector('.fade-in-button')
const fadeOutButton = document.querySelector('.fade-out-button')
const fadeToggleButton = document.querySelector('.fade-toggle-button')
const toggleParagraphsButton = document.querySelector('.toggle-paragraphs-button')

fadeToggleButton.addEventListener('click', function() {
  boxes.forEach((box, i) => fadeToggle({element: box}))
})

fadeInButton.addEventListener('click', function() {
  fadeIn({element: content, fadeSpeed: 800})
})

fadeOutButton.addEventListener('click', function() {
  fadeOut({element: content, fadeSpeed: 1200, easing: 'ease'})
})

toggleParagraphsButton.addEventListener('click', function() {
  paragraphs.forEach((p, i) => {
    fadeOut({
      element: p,
      fadeSpeed: 600,
      delay: i * 200,
      preventDisplayNone: true
    })
    .then(p => {
      fadeIn({
        element: p,
        fadeSpeed: 600,
        easing: 'cubic-bezier(0.25, 0.1, 0.44, 1.4)'
      })
    })
  })
})
