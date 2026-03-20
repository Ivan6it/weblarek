import { OrderView } from '../components/view/OrderView';
import { ContactsView } from '../components/view/ContactsView';
import { SuccessView } from '../components/view/SuccessView';
import { Products } from '../components/Models/Products';
import { Cart } from '../components/Models/Basket';
import { Order } from '../components/Models/Order';
import { EventEmitter } from '../components/base/Events';
import { AppApi } from '../components/base/ApiS';
import { CatalogView } from '../components/view/CatalogView';
import { Modal } from '../components/view/Modal';
import { ProductModal } from '../components/view/ProductModal';
import { IProductsLoadedEvent } from '../types';
import { IProductSelectedEvent } from '../types';
import { BasketView } from '../components/view/BasketView';
import { TPayment, IOrder, IOrderResponse } from '../types/index';
import { formatNumber } from '../utils/formatters';

export class AppPresenter {
    private modal!: Modal;
    private basketModalOpen = false;

    constructor(
        private products: Products,
        private cart: Cart,
        private order: Order,
        private events: EventEmitter,
        private api: AppApi
    ) {
        this.init();
    }

    private openBasket() {
        const basketItems = this.cart.getItems();

        const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
        if (!basketTemplate) {
            console.error('Шаблон #basket не найден');
            return;
        }

        const fragment = document.importNode(basketTemplate.content, true);
        const basketModalElement = fragment.firstElementChild as HTMLElement;

        const basketView = new BasketView(basketModalElement, this.events);

        basketView.items = basketItems.map((item, index) => {
            const cardTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
            const cardElement = document.importNode(cardTemplate.content, true).firstElementChild as HTMLElement;

            const title = cardElement.querySelector('.card__title');
            const price = cardElement.querySelector('.card__price');
            const deleteButton = cardElement.querySelector('.basket__item-delete');
            const indexEl = cardElement.querySelector('.basket__item-index');

            if (title) title.textContent = item.title;
            if (price) {
                if (item.price !== null) {
                    price.textContent = `${formatNumber(item.price)} синапсов`;
                } else {
                    price.textContent = 'Бесценно';
                }
            }
            if (indexEl) indexEl.textContent = String(index + 1);

            if (deleteButton) {
                deleteButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    cardElement.remove();
                    this.events.emit('product:remove', { product: item });
                });
            }

            return cardElement;
        });

        basketView.total = this.cart.getTotal();
        basketView.canOrder = basketItems.length > 0;

        this.events.on('cart:changed', () => {
            const items = this.cart.getItems();
            basketView.total = this.cart.getTotal();
            basketView.canOrder = items.length > 0;
        });

        this.modal.render(basketModalElement);
    }

    private init() {
        const modalContainer = document.getElementById('modal-container');
        if (!modalContainer) {
            console.error('Контейнер модалки не найден');
            return;
        }

        this.modal = new Modal(modalContainer, this.events);

        this.events.on('modal:close', () => {
            this.basketModalOpen = false;
        });

        // Загрузка товаров
        this.api.getProducts()
            .then((result) => {
                this.products.setItems(result);
                this.events.emit('products:loaded', { items: result });
                this.events.emit('cart:changed');
            })
            .catch((error) => {
                console.error('Ошибка загрузки товаров:', error);
                this.events.emit('cart:changed');
            });

        // Отображение каталога
        this.events.on<IProductsLoadedEvent>('products:loaded', (data) => {
            const gallery = document.querySelector<HTMLElement>('.gallery');
            if (gallery) {
                const catalog = new CatalogView(gallery, this.events);
                catalog.render(data.items);
            }
        });

        // Открытие модалки с товаром
        this.events.on<IProductSelectedEvent>('product:selected', (data) => {
            const template = document.getElementById('card-preview') as HTMLTemplateElement;
            if (!template) {
                console.error('Шаблон #card-preview не найден');
                return;
            }

            const fragment = document.importNode(template.content, true);
            const cardElement = fragment.firstElementChild as HTMLElement;

            const productModal = new ProductModal(cardElement, this.events, this.cart);
            productModal.data = data.product;
            this.modal.render(productModal.element);
        });

        // Добавление в корзину
        this.events.on<IProductSelectedEvent>('product:add', (data) => {
            this.cart.add(data.product);
            this.events.emit('cart:changed');
        });

        // Удаление из корзины
        this.events.on<IProductSelectedEvent>('product:remove', (data) => {
            this.cart.remove(data.product.id);
            this.events.emit('cart:changed');
        });

        // Обновление счётчика корзины
        this.events.on('cart:changed', () => {
            const basketCounter = document.querySelector('.header__basket-counter');
            if (basketCounter) {
                basketCounter.textContent = String(this.cart.getTotalCount());
            }
            if (this.basketModalOpen && !this.modal.isOpen()) {
                this.openBasket();
            }
        });

        // Открытие корзины
        document.querySelector('.header__basket')?.addEventListener('click', () => {
            this.basketModalOpen = true;
            this.openBasket();
        });

        // Форма способ оплаты + адрес
        this.events.on('basket:order', () => {
            const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
            if (!orderTemplate) {
                console.error('Шаблон #order не найден');
                return;
            }

            const fragment = document.importNode(orderTemplate.content, true);
            const orderElement = fragment.firstElementChild as HTMLElement;

            const orderView = new OrderView(orderElement, this.events);
            orderView.render();
            this.modal.render(orderView.element);
        });

        // Форма почта + телефон
        this.events.on('order:next', (data: { payment: TPayment; address: string }) => {
            this.order.setPayment(data.payment);
            this.order.setAddress(data.address);

            const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
            if (!contactsTemplate) {
                console.error('Шаблон #contacts не найден');
                return;
            }

            const fragment = document.importNode(contactsTemplate.content, true);
            const contactsElement = fragment.firstElementChild as HTMLElement;

            const contactsView = new ContactsView(contactsElement, this.events);
            contactsView.render();
            this.modal.render(contactsView.element);
        });

        // Отправка заказа
        this.events.on('contacts:submit', (data: { email: string; phone: string }) => {
            this.order.setEmail(data.email);
            this.order.setPhone(data.phone);

            const errors = this.order.validate();
            if (Object.keys(errors).length > 0) {
                console.error('Ошибки валидации:', errors);
                return;
            }

            const orderData: IOrder = {
                ...this.order.getData(),
                total: this.cart.getTotal(),
                items: this.cart.getItems().map(item => item.id)
            };

            this.api.postOrder(orderData)
                .then((result: IOrderResponse) => {
                    this.cart.clear();
                    this.order.clear();
                    this.events.emit('cart:changed');

                    const successTemplate = document.getElementById('success') as HTMLTemplateElement;
                    if (!successTemplate) {
                        console.error('Шаблон #success не найден');
                        return;
                    }

                    const fragment = document.importNode(successTemplate.content, true);
                    const successElement = fragment.firstElementChild as HTMLElement;

                    const successView = new SuccessView(successElement, this.events, this.modal);
                    successView.render({ total: result.total });

                    this.modal.render(successView.element);

                    this.basketModalOpen = false;
                })
                .catch(err => {
                    console.error('Ошибка отправки заказа:', err);
                });
        });
    }
}