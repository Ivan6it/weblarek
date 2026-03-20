import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';
import { CDN_URL } from '../../utils/constants';
import { categoryMap } from '../../utils/constants';
import { formatNumber } from '../../utils/formatters';

export class CatalogView {
    private container: HTMLElement;

    constructor(container: HTMLElement, private events: EventEmitter) {
        this.container = container;
    }

    render(items: IProduct[]): void {
        this.container.innerHTML = '';

        const cardTemplate = document.getElementById('card-catalog');
        if (!cardTemplate) {
            console.error('Шаблон #card-catalog не найден');
            return;
        }

        const content = (cardTemplate as HTMLTemplateElement).content;
        const templateClone = content.firstElementChild?.cloneNode(true) as HTMLElement;
        if (!templateClone) {
            console.error('Не удалось клонировать содержимое шаблона');
            return;
        }

        items.forEach(item => {
            const cardElement = templateClone.cloneNode(true) as HTMLElement;
            const title = cardElement.querySelector('.card__title');
            const price = cardElement.querySelector('.card__price');
            const category = cardElement.querySelector('.card__category');
            const image = cardElement.querySelector('.card__image');

            if (title) title.textContent = item.title;
            if (price) {
                if (item.price === null) {
                    price.textContent = 'Бесценно';
                } else {
                    price.textContent = `${formatNumber(item.price)} синапсов`;
                }
            }
            if (category) {
                category.textContent = item.category;

                if (item.category in categoryMap) {
                const categoryClass = categoryMap[item.category as keyof typeof categoryMap];
                category.classList.add(categoryClass);
            }
            }

            // Установка изображения
            if (image && item.image) {
                const imagePath = item.image.replace(/\.svg$/i, '.png');
                (image as HTMLImageElement).src = `${CDN_URL}/${imagePath}`;
                (image as HTMLImageElement).alt = item.title;
            }

            cardElement.addEventListener('click', () => {
                this.events.emit('product:selected', { product: item });
            });

            this.container.append(cardElement);
        });
    }
}