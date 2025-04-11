"use client";
import { CartItemType, CustomCoilItemType, FinalCartItem } from "@/lib/interfaces/CartInterface";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

interface CartContextType {
  cartItems: FinalCartItem;
  setAllToCart: (items: FinalCartItem) => void;
  addToCart: (item: CartItemType) => void;
  addCustomCoilToCart: (customCoil: CustomCoilItemType) => void;
  removeCustomCoilFromCart: (customCoil: CustomCoilItemType) => void;
  updateCustomCoilToCart: (customCoil: CustomCoilItemType) => void;
  decrementToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  updateProductToCart: (item: CartItemType) => void;
}

const CartContext = createContext<CartContextType>({
  cartItems: { items: [], customCoils: [] },
  setAllToCart: () => {},
  addToCart: () => {},
  addCustomCoilToCart: () => {},
  removeCustomCoilFromCart: () => {},
  updateCustomCoilToCart: () => {},
  decrementToCart: () => {},
  removeFromCart: () => {},
  updateProductToCart: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState<FinalCartItem>(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cartItems");
      try {
        const parsedCart = storedCart ? JSON.parse(storedCart) : { items: [], customCoils: [] };
        // Ensure both items and customCoils exist
        return {
          items: Array.isArray(parsedCart.items) ? parsedCart.items : [],
          customCoils: Array.isArray(parsedCart.customCoils) ? parsedCart.customCoils : []
        };
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        return { items: [], customCoils: [] };
      }
    }
    return { items: [], customCoils: [] };
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const setAllToCart = (items: FinalCartItem) => {
    // Ensure both items and customCoils exist in the input
    console.log("items", items);
    console.log("setAllTOcart items", items.items);
    console.log("setAllTOcart customCOil", items.customCoils);
    const safeItems = {
      items: Array.isArray(items.items) ? items.items : [],
      customCoils: Array.isArray(items.customCoils) ? items.customCoils : []
    };
    setCartItems(safeItems);
  };

  const addToCart = async (item: CartItemType) => {
    console.log("adding to cart", item);
    
    // Update local state first
    setCartItems((prev) => {
      // Ensure items array exists
      const currentItems = Array.isArray(prev.items) ? prev.items : [];
      // Check if an item with the same ID already exists
      const existingItemIndex = currentItems.findIndex(i => i._id === item._id);
      
      if (existingItemIndex >= 0) {
        // If item exists, update its quantity
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: item.quantity
        };
        
        return { 
          ...prev, 
          items: updatedItems,
          customCoils: Array.isArray(prev.customCoils) ? prev.customCoils : []
        };
      } else {
        // If item doesn't exist, add it to the array
        return { 
          ...prev, 
          items: [...currentItems, item],
          customCoils: Array.isArray(prev.customCoils) ? prev.customCoils : []
        };
      }
    });

    // Then update the server if user is logged in
    if (user?.userId) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: user.userId,
            productId: item._id,
            quantity: item.quantity,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          alert(data.error || "Adding To Cart Failed");
          console.log(data.error || "Adding To Cart Failed");
        } else {
          console.log("Product added successfully");
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  // Helper function to check if two custom coils are the same (except for quantity)
  const areCustomCoilsEqual = (coil1: CustomCoilItemType, coil2: CustomCoilItemType): boolean => {
    return coil1.coilType === coil2.coilType &&
           coil1.height === coil2.height &&
           coil1.length === coil2.length &&
           coil1.rows === coil2.rows &&
           coil1.fpi === coil2.fpi &&
           coil1.endplateType === coil2.endplateType &&
           coil1.circuitType === coil2.circuitType &&
           coil1.numberOfCircuits === coil2.numberOfCircuits &&
           coil1.headerSize === coil2.headerSize &&
           coil1.tubeType === coil2.tubeType &&
           coil1.pipeType === coil2.pipeType &&
           coil1.finType === coil2.finType &&
           coil1.distributorHoles === coil2.distributorHoles &&
           coil1.distributorHolesDontKnow === coil2.distributorHolesDontKnow &&
           coil1.inletConnection === coil2.inletConnection &&
           coil1.inletConnectionDontKnow === coil2.inletConnectionDontKnow;
  };

  const addCustomCoilToCart = async (item: CustomCoilItemType) => {
    console.log("adding custom coil to cart", item);
    
    // Update local state first
    setCartItems((prev) => {
      // Ensure customCoils array exists
      const currentCustomCoils = Array.isArray(prev.customCoils) ? prev.customCoils : [];
      
      // Check if a custom coil with the same specifications already exists
      const existingCoilIndex = currentCustomCoils.findIndex(c => areCustomCoilsEqual(c, item));
      
      if (existingCoilIndex >= 0) {
        // If coil exists, update its quantity
        const updatedCoils = [...currentCustomCoils];
        updatedCoils[existingCoilIndex] = {
          ...updatedCoils[existingCoilIndex],
          quantity: item.quantity
        };
        
        return { 
          ...prev, 
          items: Array.isArray(prev.items) ? prev.items : [],
          customCoils: updatedCoils 
        };
      } else {
        // If coil doesn't exist, add it to the array
        return { 
          ...prev, 
          items: Array.isArray(prev.items) ? prev.items : [],
          customCoils: [...currentCustomCoils, item] 
        };
      }
    });

    // Then update the server if user is logged in
    if (user?.userId) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/addCustomCoil`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...item,
            user: user.userId
          }),
        });
        
        const data = await response.json();
        if (!response.ok) {
          alert(data.error || "Adding Custom Coil To Cart Failed");
          console.log(data.error || "Adding Custom Coil To Cart Failed");
        } else {
          console.log("Custom coil added successfully");
        }
      } catch (error) {
        console.error("Error adding custom coil to cart:", error);
      }
    }
  };



  const removeCustomCoilFromCart = async (item: CustomCoilItemType) => {
    console.log("removing custom coil from cart", item);
    
    // Update local state first
    setCartItems((prev) => {
      // Ensure customCoils array exists
      const currentCustomCoils = Array.isArray(prev.customCoils) ? prev.customCoils : [];
      
      // Find and remove the coil that matches all specifications
      const updatedCoils = currentCustomCoils.filter(c => !areCustomCoilsEqual(c, item));
      
      return { 
        ...prev, 
        items: Array.isArray(prev.items) ? prev.items : [],
        customCoils: updatedCoils 
      };
    });
  
    // Then update the server if user is logged in
    if (user?.userId) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/deleteCustomCoil`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...item,
            userId: user.userId
          }),
        });
        
        const data = await response.json();
        if (!response.ok) {
          alert(data.error || "Removing Custom Coil From Cart Failed");
          console.log(data.error || "Removing Custom Coil From Cart Failed");
        } else {
          console.log("Custom coil removed successfully");
        }
      } catch (error) {
        console.error("Error removing custom coil from cart:", error);
      }
    }
  };




  const updateProductToCart = (item: CartItemType) => {
    console.log("updating product in cart", item);
    setCartItems((prev) => {
      const currentItems = Array.isArray(prev.items) ? prev.items : [];
      const updatedItems = currentItems.map(i => 
        i._id === item._id ? { ...i, quantity: item.quantity } : i
      );
      
      return { 
        ...prev, 
        items: updatedItems,
        customCoils: Array.isArray(prev.customCoils) ? prev.customCoils : []
      };
    });
  };

  const updateCustomCoilToCart = (item: CustomCoilItemType) => {
    console.log("updating custom coil in cart", item);
    setCartItems((prev) => {
      const currentCustomCoils = Array.isArray(prev.customCoils) ? prev.customCoils : [];
      const updatedCoils = currentCustomCoils.map(coil => 
        areCustomCoilsEqual(coil, item) ? { ...coil, quantity: item.quantity } : coil
      );
      
      return { 
        ...prev, 
        items: Array.isArray(prev.items) ? prev.items : [],
        customCoils: updatedCoils 
      };
    });
  };

  const decrementToCart = (id: string) => {
    console.log("decrement item in cart", id);
    setCartItems((prev) => {
      const currentItems = Array.isArray(prev.items) ? prev.items : [];
      const updatedItems = currentItems.map(i => 
        i._id === id ? { ...i, quantity: i.quantity - 1 } : i
      ).filter(i => i.quantity > 0);
      
      return { 
        ...prev, 
        items: updatedItems,
        customCoils: Array.isArray(prev.customCoils) ? prev.customCoils : []
      };
    });
  };

  const removeFromCart = async (id: string) => {
    console.log("removing from the cart with productId", id);
    
    // Update local state first
    setCartItems((prev) => {
      const currentItems = Array.isArray(prev.items) ? prev.items : [];
      const updatedItems = currentItems.filter(i => i._id !== id);
      return { 
        ...prev, 
        items: updatedItems,
        customCoils: Array.isArray(prev.customCoils) ? prev.customCoils : []
      };
    });

    // Then update the server if user is logged in
    if (user?.userId) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.userId }),
        });
        
        const data = await response.json();
        if (!response.ok) {
          alert(data.error || "Deleting From Cart Failed");
          console.log(data.error || "Deleting From Cart Failed");
        } else {
          console.log("Product Deleted successfully");
        }
      } catch (error) {
        console.error("Error removing from cart:", error);
      }
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, setAllToCart, addToCart, addCustomCoilToCart, updateCustomCoilToCart, decrementToCart, removeFromCart, updateProductToCart, removeCustomCoilFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}