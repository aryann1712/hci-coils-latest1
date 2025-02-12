import { CartItem, useCart } from '@/context/CardContext';
import React from 'react'

const ProductCard = ({product}: {product: CartItem}) => {
    const { addToCart } = useCart();

    return (
        <div>
          <h3>{product.name}</h3>
          <button onClick={() => addToCart({ id: product.id, name: product.name, quantity: 1 })}>
            Add to Cart
          </button>
        </div>
      );
}

export default ProductCard