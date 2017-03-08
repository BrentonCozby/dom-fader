const boxes = document.querySelectorAll('.box')
const content = document.querySelector('.content')
const paragraphs = document.querySelectorAll('.content p')

const fadeInButton = document.querySelector('.fade-in-button')
const fadeOutButton = document.querySelector('.fade-out-button')
const fadeToggleButton = document.querySelector('.fade-toggle-button')
const toggleParagraphsButton = document.querySelector('.toggle-paragraphs-button')

fadeToggleButton.addEventListener('click', function() {
    boxes.forEach(box => box.fadeToggle())
})

fadeInButton.addEventListener('click', function() {
    content.fadeIn(800)
})

fadeOutButton.addEventListener('click', function() {
    content.fadeOut(1200, 'ease')
})

toggleParagraphsButton.addEventListener('click', function() {
    paragraphs.forEach(p => {
        p.fadeOut(600)
        .then(p => p.fadeIn(400, 'cubic-bezier(0.25, 0.1, 0.44, 1.4)'))
    })
})
