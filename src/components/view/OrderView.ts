import { FormView } from './FormView';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

interface IOrderForm {
    payment: string;
    address: string;
}

export class OrderView extends FormView<IOrderForm> {
    protected paymentCardButton: HTMLButtonElement;
    protected paymentCashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;
    

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
        this.paymentCardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this.paymentCashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);

        this.paymentCardButton.addEventListener('click', () => {
            events.emit('order:paymentCard');
        });

        this.paymentCashButton.addEventListener('click', () => {
            events.emit('order:paymentCash');
        });

        this.addressInput.addEventListener('input', () => {
            events.emit('order:address', {
                address: this.addressInput.value,
            });
        });

        this.submitButton.addEventListener('click', (event) => {
            event.preventDefault();
            events.emit('contact:submit');
        });
    }

    get element(): HTMLElement {
        return this.container;
    }

    paymentCard(): void {
        this.paymentCashButton.classList.remove('button_alt-active');
        this.paymentCardButton.classList.add('button_alt-active');
    }

    paymentCash(): void {
        this.paymentCardButton.classList.remove('button_alt-active');
        this.paymentCashButton.classList.add('button_alt-active');
    }

    clear(): void {
        this.paymentCardButton.classList.remove('button_alt-active');
        this.paymentCashButton.classList.remove('button_alt-active');
        this.addressInput.value = '';
    }
}