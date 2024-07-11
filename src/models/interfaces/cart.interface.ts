import { Product } from '../product.model';
export interface Cart {
    scan(item: Product): void;
    total(): void;
    clear(): void;
}