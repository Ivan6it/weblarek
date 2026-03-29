import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface ISuccessView {
    total: string;
}

export class SuccessView extends Component<ISuccessView> {
    protected totalElement: HTMLElement;
    protected buttonSuccess: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.totalElement = ensureElement<HTMLElement>('.order-success__description', container);
        this.buttonSuccess = ensureElement<HTMLButtonElement>('.order-success__close', container);

        this.buttonSuccess.addEventListener('click', () => {
            events.emit('success:clickNewPurchases');
        });
    }

    set total(total: string) {
        this.totalElement.textContent = total; 
    }
}