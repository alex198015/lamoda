const headerCityButton = document.querySelector('.header__city-button')
const subheaderCart = document.querySelector('.subheader__cart')
const cartOverlay = document.querySelector('.cart-overlay')

headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Какой у Вас город ?'

let hash = location.hash.substring(1)

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


const getData = async () => {
    const data = await fetch('db.json')

    if (data.ok) {
        return data.json()
    } else {
        throw new Error(`Данные не были получены, ошибка ${data.status} - ${data.statusText}`)
    }
}

// getData().then(data => {
//     console.log(data)
// }, err => {
//     console.error(err);
// })

const getGoods = (callback, value) => {
    getData()
    .then(data => {
        if(value) {
            callback(data.filter(item => item.category === value))
        } else {
            callback(data)
        }
    })
    .catch(err => {
        console.error(err)
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


try {
    const goodsList = document.querySelector('.goods__list') 

    if (!goodsList) {
        throw 'This is not a goods page !'
    }

    const createCard = ({brand, cost, id, name, preview, sizes, category }) => {
        
        const navigationLink = [...document.querySelectorAll('.navigation__link')]

        navigationLink.forEach(item => {
            if (item.href.split('#')[1] === category) {
                goodsList.previousElementSibling.textContent = item.textContent
            }
        })
       
        const size = sizes ? sizes.join(' , ') : null
       
        const li = document.createElement('li')
        li.classList.add('goods__item')

        li.innerHTML = `
            <article class="good">
                <a class="good__link-img" href="card-good.html#${id}">
                    <img class="good__img" src="goods-image/${preview}" alt="">
                </a>
                <div class="good__description">
                    <p class="good__price">${cost} &#8381;</p>
                    <h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
                    ${sizes ? `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${size}</span></p>` : ''}
                    <a class="good__link" href="card-good.html#${id}">Подробнее</a>
                </div>
            </article>
        `
        return li
    }

    const renderGoodsList = data => {
       
        goodsList.innerHTML = ''
        // for (let i = 0 ; i < data.length ; i++) {
        //     console.log(data[i]);
        //     goodsList.insertAdjacentElement('beforeend', createCard(data[i]))
        // }
        for (const item of data) {
            console.log(item);
            goodsList.insertAdjacentElement('beforeend', createCard(item))
        }
    } 
    window.addEventListener('hashchange', () => {
        hash = location.hash.substring(1)
        getGoods(renderGoodsList, hash)
    })
    getGoods(renderGoodsList, hash)

} catch (e) {
    console.warn(e);
}
