import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { renderPrice } from "../../utils/upPrice";

export abstract class View extends Component<unknown> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title', container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', container);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value ? `${renderPrice(value)} синапсов` : 'Бесценно';
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }
}