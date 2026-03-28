import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { View } from "./View";
import { categoryMap } from '../../utils/constants';

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
        this.categoryElement.className = 'card__category';
        const style = categoryMap[value as keyof typeof categoryMap];
        this.categoryElement.classList.add(style);
        this.categoryElement.textContent = value;
    }
}