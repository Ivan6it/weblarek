import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { renderPrice } from '../../utils/upPrice';

interface IBasketData {
    items: HTMLElement[];
    total: number;
}

export class BasketView extends Component<IBasketData> {
    protected listContainer: HTMLElement;
    protected totalElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.listContainer = ensureElement<HTMLElement>('.basket__list', container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
        this.button = ensureElement<HTMLButtonElement>('.basket__button', container);

        this.button.addEventListener('click', () => {
            events.emit('order:submit');
        });
    }

    set total(value: number) {
        this.totalElement.textContent = `${renderPrice(value)} синапсов`;
    }

    set items(items: HTMLElement[]) {
        if (items.length === 0) {
            this.listContainer.innerHTML = '';
            this.button.disabled = true;
        } else {
            this.listContainer.replaceChildren(...items);
            this.button.disabled = false;
        }
    }

    get element(): HTMLElement {
        return this.container;
    }
}