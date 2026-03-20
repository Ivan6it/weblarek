import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';
import { CDN_URL } from '../../utils/constants';
import { categoryMap } from '../../utils/constants';
import { Cart } from '../../components/Models/Basket';
import { formatNumber } from '../../utils/formatters';

export class ProductModal {
    private _container: HTMLElement;
    private title: HTMLElement | null;
    private image: HTMLImageElement | null;
    private category: HTMLElement | null;
    private description: HTMLElement | null;
    private price: HTMLElement | null;
    private button: HTMLButtonElement | null;

    private _data!: IProduct;

    constructor(
        container: HTMLElement,
        protected events: EventEmitter,
        private cartModel: Cart
    ) {
        this._container = container;
        this.title = this._container.querySelector('.card__title');
        this.image = this._container.querySelector('.card__image');
        this.category = this._container.querySelector('.card__category');
        this.description = this._container.querySelector('.card__text');
        this.price = this._container.querySelector('.card__price');
        this.button = this._container.querySelector('.card__button');

        this.events.on('cart:changed', () => {
            this.updateButtonState();
        });

        if (this.button) {
            this.button.addEventListener('click', () => {
                if (this.cartModel.hasItem(this._data.id)) {
                    this.events.emit('product:remove', { product: this._data });
                } else {
                    this.events.emit('product:add', { product: this._data });
                }
            });
        }
    }

    set data(value: IProduct) {
        this._data = value;
        this.updateButtonState();

        if (this.title) this.title.textContent = value.title;
        if (this.image) {
            const imagePath = value.image.replace(/\.svg$/i, '.png');
            this.image.src = `${CDN_URL}/${imagePath}`;
            this.image.alt = value.title;
        }
        if (this.category) {
            this.category.textContent = value.category;
            this.category.classList.remove(
                'card__category_soft',
                'card__category_hard',
                'card__category_button',
                'card__category_additional',
                'card__category_other'
            );
            if (value.category in categoryMap) {
                const categoryClass = categoryMap[value.category as keyof typeof categoryMap];
                this.category.classList.add(categoryClass);
            }
        }
        if (this.description) this.description.textContent = value.description;
        if (this.price) {
            if (value.price !== null) {
                this.price.textContent = `${formatNumber(value.price)} синапсов`;
            } else {
                this.price.textContent = 'Бесценно';
            }
        }
        if (this.button) {
            this.button.disabled = value.price === null;
        }
    }

    updateButtonState() {
        if (!this.button || !this._data) return;

        if (this._data.price === null) {
            this.button.textContent = 'Недоступно';
            this.button.disabled = true;
        } else if (this.cartModel.hasItem(this._data.id)) {
            this.button.textContent = 'Удалить из корзины';
            this.button.disabled = false;
        } else {
            this.button.textContent = 'Купить';
            this.button.disabled = false;
        }
    }

    get data(): IProduct {
        return this._data;
    }

    get element(): HTMLElement {
        return this._container;
    }
}