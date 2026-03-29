import { ensureElement } from '../../utils/utils';
import { cardView } from './CardView';
import { IBasketActions } from '../../types';

interface ICardBasket {
    index: number;
};

export class BasketItem extends cardView<ICardBasket> {
    protected indexElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, actions: IBasketActions) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
        this.button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this.button.addEventListener('click', () => {
            actions.OnClick();
        });
    }

    set index(value: number) {
        this.indexElement.textContent = value.toString();
    }
}