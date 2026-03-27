import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { View } from "./View";

export class CartCatalog extends View  {
    imageElement: HTMLImageElement;
    categoryElement: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);

        this.container.addEventListener('click', () => {
            events.emit('card:select', {
                id: this.container.dataset.id,
            })
        });
    }

    set image(src: string) {
        this.setImage(this.imageElement, src);
    }

    set category(value: string) {
        const categoryStyles: Record<string, string> = {
            'софт-скил': 'card__category_soft',
            'хард-скил': 'card__category_hard',
            'другое': 'card__category_other',
            'дополнительное': 'card__category_additional',
            'цифровые товары': 'card__category_figure',
            'кнопка': 'card__category_button',
        };

        this.categoryElement.className = 'card__category';
        const style = categoryStyles[value];
        this.categoryElement.classList.add(style);
        this.categoryElement.textContent = value;
    }
}