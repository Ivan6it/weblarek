import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';
import { getApiImageUrl } from '../../utils/graphics';
import { View } from './View';
import { categoryMap } from '../../utils/constants';

interface ICardPreviewData {
    product: IProduct;
    buttonText: string;
    buttonEnabled: boolean;
}

export class CardPreview extends View {
    protected description: HTMLElement;
    protected button: HTMLButtonElement;
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
        this.description = ensureElement<HTMLElement>('.card__text', container);
        this.button = ensureElement<HTMLButtonElement>('.card__button', container);

        this.button.addEventListener('click', () => {
            events.emit('card:add/deleteBasket', {
                id: this.container.dataset.id,
            });
        });
    }

    setProductId(id: string): void {
        this.container.dataset.id = id;
    }

    set descriptionText(text: string) {
        this.description.textContent = text;
    }

    set image(src: string) {
        this.setImage(this.imageElement, src);
    }

    set inCart(value: boolean) {
        this.button.textContent = value ? 'Удалить из корзины' : 'Купить';
    }

    setData(data: ICardPreviewData): void {
        const { product, buttonText, buttonEnabled } = data;

        this.container.dataset.id = product.id;
        this.title = product.title;
        this.image = getApiImageUrl(product.image);
        this.category = product.category;
        this.price = product.price;
        this.descriptionText = product.description;
        this.button.textContent = buttonText;
        this.button.disabled = !buttonEnabled;
    }

    render(): HTMLElement {
        super.render({});
        return this.container;
    }

    set category(value: string) {
        this.categoryElement.className = 'card__category';
        const style = categoryMap[value as keyof typeof categoryMap];
        this.categoryElement.classList.add(style);
        this.categoryElement.textContent = value;
    }
}