import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';
import { View } from './View';

export class BasketItem extends View {
    protected indexElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
        this.button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this.button.addEventListener('click', () => {
            events.emit('card:deleteBasketItem', {
                id: this.container.dataset.id,
            })
        });
    }
    set index(value: number) {
        this.indexElement.textContent = value.toString();
    }

    get element(): HTMLElement {
        return this.container;
    }

    renderAsBasketItem(product: IProduct, index: number): HTMLElement {
        this.index = index;
        this.title = product.title;
        this.price = product.price ?? 0;
        this.id = product.id;

        return this.element;
    }
}