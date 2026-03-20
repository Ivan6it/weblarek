import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { TPayment } from '../../types';

interface IOrderData {
    payment: TPayment;
    address: string;
}

export class OrderView extends Component<IOrderData> {
    protected addressInput: HTMLInputElement;
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected nextButton: HTMLButtonElement;
    protected errorElement: HTMLElement;

    private payment: TPayment = null;
    private isAddressTouched = false;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);

        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', container);
        this.nextButton = ensureElement<HTMLButtonElement>('.order__button', container);
        this.errorElement = ensureElement<HTMLElement>('.form__errors', container);

        this.addressInput.addEventListener('focus', () => {
            this.isAddressTouched = true;
            if (this.errorElement.textContent) {
                this.hideError();
            }
        });

        this.addressInput.addEventListener('input', () => {
            this.validate();
        });

        this.addressInput.addEventListener('blur', () => {
            this.validateOnBlur();
        });

        this.cardButton.addEventListener('click', () => {
            this.setPayment('card');
            this.validateOnBlur();
        });

        this.cashButton.addEventListener('click', () => {
            this.setPayment('cash');
            this.validateOnBlur();
        });

        this.nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.isAddressTouched = true;
            this.payment = this.payment || null;
            this.validate(true);
            if (this.isValid()) {
                this.events.emit('order:next', {
                    payment: this.payment,
                    address: this.addressInput.value.trim()
                });
            }
        });

        this.validate();
    }

    private validateOnBlur() {
        const address = this.addressInput.value.trim();
        const isAddressValid = !!address;
        const isPaymentValid = !!this.payment;

        if (this.isAddressTouched && !isAddressValid && !isPaymentValid) {
            this.showError('Необходимо указать способ оплаты и адрес');
            return;
        }

        if (this.isAddressTouched && !isAddressValid) {
            this.showError('Необходимо указать адрес');
            return;
        }

        if (isAddressValid && !isPaymentValid) {
            this.showError('Необходимо указать способ оплаты');
            return;
        }

        this.hideError();
    }

    private setPayment(value: TPayment) {
        this.payment = value;
        this.cardButton.classList.toggle('button_alt-active', value === 'card');
        this.cashButton.classList.toggle('button_alt-active', value === 'cash');
        this.validate();
    }

    private validate(forceShow = false) {
        const address = this.addressInput.value.trim();
        const isAddressValid = !!address;
        const isPaymentValid = !!this.payment;

        const isValid = isAddressValid && isPaymentValid;

        this.nextButton.disabled = !isValid;

        if (forceShow) {
            if (!isPaymentValid && !isAddressValid) {
                this.showError('Необходимо указать способ оплаты и адрес');
            } else if (!isPaymentValid) {
                this.showError('Необходимо указать способ оплаты');
            } else if (!isAddressValid) {
                this.showError('Необходимо указать адрес');
            } else {
                this.hideError();
            }
        }

        return isValid;
    }

    private isValid(): boolean {
        const address = this.addressInput.value.trim();
        return !!this.payment && !!address;
    }

    private showError(message: string) {
        this.errorElement.textContent = message;
    }

    private hideError() {
        this.errorElement.textContent = '';
    }

    render(): HTMLElement {
        this.payment = null;
        this.nextButton.disabled = true;
        this.addressInput.value = '';
        this.isAddressTouched = false;
        this.cardButton.classList.remove('button_alt-active');
        this.cashButton.classList.remove('button_alt-active');
        this.hideError();
        this.validate();
        return this.container;
    }
}