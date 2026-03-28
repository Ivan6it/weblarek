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

// --- События ---
const events = new EventEmitter();

// --- Модели ---
const productsModel = new Products();
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
const basketView = new BasketView(cloneTemplate<HTMLDivElement>('#basket'), events);

// --- Форма заказа ---
const orderViewContainer = cloneTemplate<HTMLFormElement>('#order');
const orderView = new OrderView(orderViewContainer, events);

// --- Контакты ---
const contactsViewContainer = cloneTemplate<HTMLFormElement>('#contacts');
const contactsView = new ContactsView(contactsViewContainer, events);

// --- Успех ---
const successViewContainer = cloneTemplate<HTMLFormElement>('#success');
const successView = new SuccessView(successViewContainer, events);

appApi.getProducts()
    .then(items => {
        productsModel.setItems(items);

        const cardElements = items.map(item => {
            const cardElement = cloneTemplate<HTMLButtonElement>('#card-catalog');
            cardElement.dataset.id = item.id;
            const card = new CartCatalog(cardElement, events);

            card.title = item.title;
            card.image = getApiImageUrl(item.image);
            card.price = item.price;
            card.category = item.category;

        return card.render() as HTMLElement;
        });
        gallery.catalog = cardElements;
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });

//------------ Начало работы презентора

events.on('card:select', (data: { id: string }) => {
    const product = productsModel.getProductById(data.id);
    if (product) {
        if (product.price === null) {
                cardPreview.setData({
                product,
                buttonText: 'Недоступно',
                buttonEnabled: false,
            });
        } else {
            cardPreview.setData({
                product,
                buttonText: cart.hasItem(product.id) ? 'Удалить из корзины' : 'Купить',
                buttonEnabled: true,
            });
        }

        modal.render({
            content: cardPreview.render()
        });

        modal.open();
    }
});

events.on('card:add/deleteBasket', (data: { id: string }) => {
    const product = productsModel.getProductById(data.id);
    if (product) {
        if (!cart.hasItem(product.id)) {
            cart.add(product);
        } else {
            cart.remove(product.id);
        }

        cardPreview.inCart = cart.hasItem(product.id);
    }
});

events.on('modal:close', () => {
    modal.close();
})

events.on('modal:close(Overlay)', () => {
    modal.close();
})

events.on('basket:change', () => {
    headerBasket.counter = cart.getTotalCount();
    const products = cart.getItems();
    const basketItems = products.map((product, index) => {
        const itemElement = cloneTemplate(basketItemTemplate);
        const item = new BasketItem(itemElement, events);
        return item.renderAsBasketItem(product, index + 1);
    });

    basketView.items = basketItems;
    basketView.total = cart.getTotal();
});

events.on('card:deleteBasketItem', (data: { id: string }) => {
    cart.remove(data.id);
});

events.on('basket:open', () => {
    modal.render({
        content: basketView.render()
    });

    modal.open();
})

events.on('order:submit', () => {
    order.clear();
    orderView.setError('');
    orderView.submitValidation(false);
    modal.render({
        content: orderView.element
    });
    modal.open();
});

events.on('clear', () => {
    orderView.clear();
});

events.on('order:paymentCard', () => {
    order.setPayment('card');
});

events.on('order:paymentCash', () => {
    order.setPayment('cash');
});

events.on('set:payment', (data: {payment: string}) => {
    const errors = order.validate();
    const isFormValid = !errors.payment && !errors.address;
    if (data.payment === 'card') {
        orderView.paymentCard();
    } else {
        orderView.paymentCash();
    }
    orderView.setError('');
    orderView.submitValidation(isFormValid);
});

events.on('order:address', (data: { address: string }) => {
    order.setAddress(data.address);
});

events.on('set:address', () => {
    const errors = order.validate();
    const isFormValid = !errors.payment && !errors.address;
    if (errors.payment) {
        orderView.setError(errors.payment);
    } else if (errors.address) {
        orderView.setError(errors.address);
    } else {
        orderView.setError('');
    }
    orderView.submitValidation(isFormValid);
})

events.on('contact:submit', () => {
    contactsView.clear();
    contactsView.setError('');
    contactsView.submitValidation(false);
    modal.render({
        content: contactsView.element
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
    const errors = order.validate();
    const isFormValid = !errors.email && !errors.phone;
    if (errors.email) {
        contactsView.setError(errors.email);
    } else if (errors.phone) {
        contactsView.setError(errors.phone);
    } else {
        contactsView.setError('');
    }
    contactsView.submitValidation(isFormValid);
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
        successView.setTotal(result.total);
        modal.render({
            content: successView.element
        });
        modal.open();
    })

    .catch(error => {
        console.error('Ошибка при отправке заказа:', error);
    });
});