const headerCityButton = document.querySelector('.header__city-button')
const subheaderCart = document.querySelector('.subheader__cart')
const cartOverlay = document.querySelector('.cart-overlay')

headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Какой у Вас город ?'

const cartModalOpen = () => {
    cartOverlay.classList.add('cart-overlay-open')
    disableScroll()
}

const cartModalClose = () => {
    cartOverlay.classList.remove('cart-overlay-open')
    enableScroll()
}

const disableScroll = () => {
    const widthScroll = window.innerWidth - document.body.offsetWidth
    document.body.dbScrollY = window.scrollY
    document.body.style.cssText = ` 
        position: fixed;
        width: 100%;
        top: ${-window.scrollY}px;
        left: 0;
        height: 100vh;
        overflow: hidden;
        padding-right: ${widthScroll}px
    `
}

const enableScroll = () => {
    document.body.style.cssText = ''
    window.scroll({
        top: document.body.dbScrollY,
    })
}

headerCityButton.addEventListener('click', () => {
    const city = prompt('Укажите ваш город ?')
    headerCityButton.textContent = city
    localStorage.setItem('lomoda-location', city)
})

subheaderCart.addEventListener('click', cartModalOpen)

cartOverlay.addEventListener('click', (event) => {
    const target = event.target
    if(target.closest('.cart__btn-close') || target.matches('.cart-overlay')) {
        cartModalClose()
    }
})

