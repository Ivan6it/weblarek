import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { cardView } from './CardView';
import { categoryMap } from '../../utils/constants';

interface ICardPreviewData {
    image: string;
    buttonText: string;
    descriptionText: string;
    category: string;
    buttonEnabled: boolean;
}

export class CardPreview extends cardView<ICardPreviewData> {
    protected descriptionElement: HTMLElement;
    protected button: HTMLButtonElement;
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
        this.button = ensureElement<HTMLButtonElement>('.card__button', container);

        this.button.addEventListener('click', () => {
            events.emit('preview:clicked');
        });
    }

    set description(text: string) {
        this.descriptionElement.textContent = text;
    }

    set image(src: string) {
        this.setImage(this.imageElement, src);
    }

    set buttonText(value: string) {
        this.button.textContent = value;
    }

    set category(value: string) {
        this.categoryElement.className = 'card__category';
        const style = categoryMap[value as keyof typeof categoryMap];
        this.categoryElement.classList.add(style);
        this.categoryElement.textContent = value;
    }

    set buttonEnabled(value: boolean) {
        this.button.disabled = !value;
    }
}