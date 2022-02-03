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

const getGoods = (callback, prop , value) => {
    getData()
    .then(data => {
        if(value) {
            callback(data.filter(item => item[prop] === value))
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

    const goodsTitle = document.querySelector('.goods__title')

    const changeTitle = () => {
        goodsTitle.textContent = document.querySelector(`[href*='#${hash}']`).textContent
    }

    const createCard = ({brand, cost, id, name, preview, sizes, category }) => {
        
        // const navigationLink = [...document.querySelectorAll('.navigation__link')]

        // navigationLink.forEach(item => {
        //     if (item.href.split('#')[1] === category) {
        //         goodsList.previousElementSibling.textContent = item.textContent
        //     }
        // })
       
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
           
            goodsList.insertAdjacentElement('beforeend', createCard(item))
        }
    } 
    window.addEventListener('hashchange', () => {
        hash = location.hash.substring(1)
        getGoods(renderGoodsList, 'category', hash)
        changeTitle()
    })
    changeTitle()
    getGoods(renderGoodsList, 'category', hash)

} catch (e) {
    console.warn(e)
}

// page of category of goods

try {
    if (!document.querySelector('.card-good')) {
        throw `This is not a card-good page`
    }

        const cardGoodImage = document.querySelector('.card-good__image')
        const cardGoodBrand = document.querySelector('.card-good__brand')
        const cardGoodTitle = document.querySelector('.card-good__title')
        const cardGoodPrice = document.querySelector('.card-good__price')
        const cardGoodColor = document.querySelector('.card-good__color')
        const cardGoodSelectWrapper = document.querySelectorAll('.card-good__select__wrapper')
        const cardGoodColorList = document.querySelector('.card-good__color-list')
        const cardGoodSizes = document.querySelector('.card-good__sizes')
        const cardGoodSizesList = document.querySelector('.card-good__sizes-list')
        const cardGoodBuy = document.querySelector('.card-good__buy')

        // generateList = (data) => {
        //     return data.map(item => {
        //         return `
        //             <li class="card-good__select-item">${item}</li>
        //         `
        //     })
        // }

        generateList = data => data.reduce((html, item, i) => html + `<li class="card-good__select-item" data-id="${i}">${item}</li>`, '')

        const renderCardGood = ([{brand, cost, name, color, sizes, photo}]) => {
            
            cardGoodImage.src = `goods-image/${photo}`
            cardGoodImage.alt = `${brand} ${name}`
            cardGoodBrand.textContent = brand
            cardGoodTitle.textContent = name
            cardGoodPrice.textContent = `${cost} ₽`
            if(color) {
                cardGoodColor.textContent = color[0]
                cardGoodColor.dataset.id - 0
                cardGoodColorList.innerHTML = generateList(color)
            } else {
                cardGoodColor.style.display = 'none'
            }

            if(sizes) {
                cardGoodSizes.textContent = sizes[0]
                cardGoodSizes.dataset.id - 0
                cardGoodSizesList.innerHTML = generateList(sizes)
            } else {
                cardGoodSizes.style.display = 'none'
            }

           
        }

        cardGoodSelectWrapper.forEach(item => {
            item.addEventListener('click', (e) => {
                const target = e.target
                if (target.closest('.card-good__select')) {
                    target.classList.toggle('card-good__select__open')
                }
                if (target.closest('.card-good__select-item')) {
                    const cardGoodSelect = item.querySelector('.card-good__select')
                    cardGoodSelect.textContent = target.textContent
                    cardGoodSelect.dataset.id = target.dataset.id
                    cardGoodSelect.classList.remove('card-good__select__open')
                }
            
            })
        })

        getGoods(renderCardGood,'id', hash)
        

} catch (err) {
    console.warn(err)
}


