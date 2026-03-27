import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { renderPrice } from '../../utils/upPrice';

interface ISuccessView {
    total: number;
}

export class SuccessView extends Component<ISuccessView> {
    protected total: HTMLElement;
    protected buttonSuccess: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.total = ensureElement<HTMLElement>('.order-success__description', container);
        this.buttonSuccess = ensureElement<HTMLButtonElement>('.order-success__close', container);

        this.buttonSuccess.addEventListener('click', () => {
            events.emit('modal:close');
        });
    }

    get element(): HTMLElement {
        return this.container;
    }

    setTotal(total: number) {
        this.total.textContent = `Списано ${renderPrice(total)} синапсов`;
    }
}