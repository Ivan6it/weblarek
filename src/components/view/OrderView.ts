import { FormView } from './FormView';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { TPayment } from '../../types';

interface IOrderForm {
    payment: TPayment;
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

        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            events.emit('contact:submit');
        });
    }

    set payment(value: TPayment) {
        this.paymentCashButton.classList.toggle('button_alt-active', value === "cash");
        this.paymentCardButton.classList.toggle('button_alt-active', value === "card");
    }

    set address(value: string) {
        this.addressInput.value = value;
    }
}