import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';
import { formatNumber } from '../../utils/formatters';

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class BasketView extends Component<IBasketView> {
    protected basketList!: HTMLElement;
    protected totalElement!: HTMLElement;
    protected orderButton!: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container, events);
        this.init();
    }

    private init() {
        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

        this.orderButton.addEventListener('click', () => {
            this.events.emit('basket:order');
        });
    }

    set items(items: HTMLElement[]) {
        this.basketList.replaceChildren(...items);
    }

    set total(value: number) {
        this.totalElement.textContent = `${formatNumber(value)} синапсов`;
    }

    set canOrder(value: boolean) {
        this.orderButton.disabled = !value;
    }
}