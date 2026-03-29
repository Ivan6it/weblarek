import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { renderPrice } from '../../utils/upPrice';
import { IBasketActions } from '../../types';

interface IBasketData {
    items: HTMLElement[];
    total: number;
}

export class BasketView extends Component<IBasketData> {
    protected listContainer: HTMLElement;
    protected totalElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, actions: IBasketActions) {
        super(container);

        this.listContainer = ensureElement<HTMLElement>('.basket__list', container);
        this.totalElement = ensureElement<HTMLElement>('.basket__price', container);
        this.button = ensureElement<HTMLButtonElement>('.basket__button', container);

        this.button.addEventListener('click', () => {
            actions.OnClick();
        });
    }

    set total(value: number) {
        this.totalElement.textContent = `${renderPrice(value)} синапсов`;
    }

    set items(items: HTMLElement[]) {
        this.listContainer.replaceChildren(...items);
        this.button.disabled = items.length === 0;
    }
}