import { CDN_URL } from '../utils/constants';

export function getApiImageUrl(imagePath: string): string {
    return imagePath
        ? `${CDN_URL}/${imagePath.replace(/\.svg$/i, '.png')}`
        : '';
}