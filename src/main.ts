import './scss/styles.scss';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Basket';
import { Order } from './components/Models/Order';
import { Api } from './components/base/Api';
import { AppApi } from './components/base/ApiS';
import { API_URL } from './utils/constants';
import { Gallery } from './components/view/Gallery';
import { cloneTemplate, ensureElement } from "./utils/utils";
import { CartCatalog } from './components/view/CartCatalog';
import { EventEmitter } from './components/base/Events';
import { CardPreview } from './components/view/CardPreview';
import { getApiImageUrl } from './utils/graphics';
import { Modal } from './components/view/Modal';
import { Header } from './components/view/Header';
import { BasketView } from './components/view/BasketView';
import { BasketItem } from './components/view/CardBasket';
import { OrderView } from './components/view/OrderView';
import { ContactsView } from './components/view/ContactsView';
import { SuccessView } from './components/view/SuccessView';
import { IProduct } from './types';
import { renderPrice } from './utils/upPrice';

// --- События ---
const events = new EventEmitter();

// --- Модели ---
const productsModel = new Products(events);
const cart = new Cart(events);
const order = new Order(events);

// --- Шапка с кнопкой корзины ---
const headerContainer = ensureElement<HTMLElement>('.header');
const headerBasket = new Header(events, headerContainer);

// --- API ---
const api = new Api(API_URL);
const appApi = new AppApi(api);

// --- Галерея ---
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));

// --- Модалка ---
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const modal = new Modal(modalContainer, events);

// --- Карточка просмотра ---
const cardPreviewElement = cloneTemplate<HTMLDivElement>('#card-preview');
const cardPreview = new CardPreview(cardPreviewElement, events);

// --- Корзина и товары, которые там лежат ---
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketView = new BasketView(cloneTemplate<HTMLDivElement>('#basket'), {
    OnClick: () => {
        events.emit('order:submit')
    }
});

// --- Форма заказа ---
const orderViewContainer = cloneTemplate<HTMLFormElement>('#order');
const orderView = new OrderView(orderViewContainer, events);

// --- Контакты ---
const contactsViewContainer = cloneTemplate<HTMLFormElement>('#contacts');
const contactsView = new ContactsView(contactsViewContainer, events);

// --- Успех ---
const successViewContainer = cloneTemplate<HTMLFormElement>('#success');
const successView = new SuccessView(successViewContainer, events);

//------------ Начало работы презентора

events.on('products:change', () => {
    const cardElements = productsModel.getItems().map(item => {
            const cardElement = cloneTemplate<HTMLButtonElement>('#card-catalog');
            const card = new CartCatalog(cardElement, {
                OnClick: () => events.emit('card:select', item),
            });
            return card.render({
                title: item.title,
                image: item.image,
                price: item.price,
                category: item.category,
            });
        });
        gallery.render( {
            catalog: cardElements
        })
});

events.on('card:select', (data: IProduct) => {
    const product = productsModel.getProductById(data.id);
    if (product) {
        productsModel.setSelectedProduct(product);
    }
});

events.on('preview:clicked', () => {
    const product = productsModel.getSelectedProduct();
    if (product) {
        if (!cart.hasItem(product.id)) {
            cart.add(product);
        } else {
            cart.remove(product.id);
        }
    }
    modal.close();
});

events.on('preview:change', () => {
    const product = productsModel.getSelectedProduct();

    if (product) {
        const itemForRender = {
            ...product,
            image: product.image,
            buttonEnabled: product.price !== null,
            buttonText:
                product.price == null
                    ? 'Недоступно'
                    : cart.hasItem(product.id) 
                        ? 'Удалить из корзины' 
                        : 'Купить',
        }

        modal.render({
        
        content: cardPreview.render(itemForRender)
    });

    modal.open();
    }
});

events.on('basket:change', () => {
    headerBasket.counter = cart.getTotalCount();
    const products = cart.getItems();
    const basketItems = products.map((product, index) => {
        const itemElement = cloneTemplate(basketItemTemplate);
        const item = new BasketItem(itemElement, {
                OnClick: () => events.emit('card:deleteBasketItem', product),
            });
        return item.render({
            ...product,
            index: index + 1,
        });
    });
    basketView.render({
        items: basketItems,
        total: cart.getTotal(),
    });
});

events.on('card:deleteBasketItem', (product: IProduct) => {
    cart.remove(product.id);
});

events.on('basket:open', () => {
    modal.render({
        content: basketView.render()
    });

    modal.open();
})

events.on('order:submit', () => {                 // Фикс бага с преждевременной отрисовкой ошибок
    orderRender();                                // Обновляю форму, чтобы получить только актуальные данные
    const errors = order.validate();              // Провожу валидацию
    if (!(!errors.payment || !errors.address)) {  // true - форма чиста, false - есть одно или более заполненных полей
        orderView.errors = "";                    // Очистка полей с ошибками
    }
    modal.render({
        content: orderView.render(),
    });

    modal.open();
});

events.on('order:paymentCard', () => {
    order.setPayment('card');
});

events.on('order:paymentCash', () => {
    order.setPayment('cash');
});

function orderRender() {
    const buyerData = order.getData();
    const buyerValidate = order.validate();
    const orderRenderData = {
        payment: buyerData.payment,
        address: buyerData.address,
        valid: !buyerValidate.payment && !buyerValidate.address,
        errors: [buyerValidate.payment,buyerValidate.address].filter(Boolean).join('; '),
    }
    orderView.render(orderRenderData);
}

function contactsRender() {
    const buyerData = order.getData();
    const buyerValidate = order.validate();
    const contactsRenderData = {
        email: buyerData.email,
        phone: buyerData.phone,
        valid: !buyerValidate.email && !buyerValidate.phone,
        errors: [buyerValidate.email,buyerValidate.phone].filter(Boolean).join('; '),
    }
    contactsView.render(contactsRenderData);
};

events.on('set:payment', () => {
    orderRender();
});

events.on('order:address', (data: { address: string }) => {
    order.setAddress(data.address);
});

events.on('set:address', () => {
    orderRender();
})

events.on('clear', () => {
    orderRender();
    contactsRender();
});

events.on('contact:submit', () => {                      // Фикс бага с преждевременной отрисовкой ошибок
        contactsRender();                                // Обновляю форму, чтобы получить только актуальные данные
        const errors = order.validate();                 // Провожу валидацию
        if (!(!errors.email || !errors.phone)) {         // true - форма чиста, false - есть одно или более заполненных полей
            contactsView.errors = "";                    // Очистка полей с ошибками
        }
    modal.render({
        content: contactsView.render(),
    });
    modal.open();
});

events.on('contacts:email', (data: { email: string }) => {
    order.setEmail(data.email);
});

events.on('contacts:phone', (data: { phone: string }) => {
    order.setPhone(data.phone);
});

events.on('set:contacts', () => {
    contactsRender();
});

events.on('success:submit', () => {
    appApi.postOrder({
        ...order.getData(),
        total: cart.getTotal(),
        items: cart.getItems().map(item => item.id)
    })

    .then(result => {
        order.clear();
        cart.clear();
        modal.render({
            content: successView.render({
                total: `Списано ${renderPrice(result.total)} синапсов`,
            }),
        });
        modal.open();
    })

    .catch(error => {
        console.error('Ошибка при отправке заказа:', error);
    });
});

events.on('success:clickNewPurchases', () => {
    modal.close();
});

function init() {
    appApi.getProducts()
    .then(items => {
        productsModel.setItems(
            items.map(item => ({
                ...item,
                image: getApiImageUrl(item.image),
            }))
        );
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
    order.clear();
    cart.clear();
}

init();