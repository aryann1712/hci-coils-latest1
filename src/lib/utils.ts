import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatProductName(product: { name: string; dimensions?: { length: number; width: number; height: number } }) {
  if (!product.dimensions) return product.name;
  
  const { length, width, height } = product.dimensions;
  const dimensions = [
    length ? length.toString() : '',
    width ? width.toString() : '',
    height ? height.toString() : ''
  ].filter(Boolean).join('/');
  
  return dimensions ? `${dimensions}/${product.name}` : product.name;
}
