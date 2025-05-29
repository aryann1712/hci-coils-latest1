"use client";
import { CartItemType, CustomCoilItemType, FinalCartItem } from "@/lib/interfaces/CartInterface";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";
import { toast } from "react-hot-toast";

interface CartContextType {
  cartItems: {
    items: CartItemType[];
    customCoils: CustomCoilItemType[];
  };
  setAllToCart: (items: FinalCartItem) => void;
  addToCart: (item: CartItemType) => Promise<void>;
  addCustomCoilToCart: (customCoil: CustomCoilItemType) => void;
  removeCustomCoilFromCart: (customCoil: CustomCoilItemType) => void;
  updateCustomCoilToCart: (customCoil: CustomCoilItemType) => void;
  decrementToCart: (id: string) => void;
  removeFromCart: (itemId: string) => void;
  updateProductToCart: (item: CartItemType) => void;
  clearCart: () => void;
  updateQuantity: (itemId: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState<{
    items: CartItemType[];
    customCoils: CustomCoilItemType[];
  }>({
    items: [],
    customCoils: [],
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const setAllToCart = (items: FinalCartItem) => {
    const safeItems = {
      items: Array.isArray(items.items) ? items.items.map(item => ({ ...item, price: item.price || 0 })) : [],
      customCoils: Array.isArray(items.customCoils) ? items.customCoils : []
    };
    setCartItems(safeItems);
  };

  const handleResponse = async (response: Response) => {
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (!response.ok) {
          if (data.error === "Cart not found") {
            // If cart not found, clear local cart and return
            setCartItems({ items: [], customCoils: [] });
            return null;
          }
          if (data.error === "Product can not be less than 1 Unit.") {
            // If trying to reduce below 1, just return without error
            return null;
          }
          throw new Error(data.error || "Operation failed");
        }
        return data;
      } else {
        if (!response.ok) {
          throw new Error("Server error occurred");
        }
        return null;
      }
    } catch (error) {
      console.error("Error handling response:", error);
      throw error;
    }
  };

  const addToCart = async (item: CartItemType) => {
    try {
      // Update local state first
      setCartItems((prevItems) => {
        const existingItem = prevItems.items.find((i) => i._id === item._id);
        if (existingItem) {
          return {
            ...prevItems,
            items: prevItems.items.map((i) =>
              i._id === item._id ? { ...i, quantity: item.quantity } : i
            ),
          };
        }
        return {
          ...prevItems,
          items: [...prevItems.items, item],
        };
      });

      // If user is logged in, update server
      if (user?.userId) {
        const token = user.token;
        if (!token) {
          toast.error("Please log in again", {
            duration: 2000,
            position: 'top-right',
            style: {
              background: '#f44336',
              color: '#fff',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            },
            icon: '🔒',
          });
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user: user.userId,
            productId: item._id,
            quantity: item.quantity,
            price: item.price || 0,
          }),
        });

        await handleResponse(response);
        toast.success('Added to cart successfully!', {
          duration: 2000,
          position: 'top-right',
          style: {
            background: '#4CAF50',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
          icon: '🛒',
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add item to cart", {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#f44336',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        },
        icon: '❌',
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      // Update local state first
      setCartItems((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item._id !== itemId),
      }));

      // If user is logged in, update server
      if (user?.userId) {
        const token = user.token;
        if (!token) {
          toast.error("Please log in again");
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/${itemId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.userId,
            productId: itemId
          }),
        });

        await handleResponse(response);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error(error instanceof Error ? error.message : "Failed to remove item from cart");
    }
  };

  const updateProductToCart = async (item: CartItemType) => {
    try {
      // Update local state first
      setCartItems((prev) => ({
        ...prev,
        items: prev.items.map((i) =>
          i._id === item._id ? { ...i, quantity: item.quantity } : i
        ),
      }));

      // If user is logged in, update server
      if (user?.userId) {
        const token = user.token;
        if (!token) {
          toast.error("Please log in again");
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/reduce/${item._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user.userId,
          }),
        });

        await handleResponse(response);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update cart item");
    }
  };

  const decrementToCart = async (id: string) => {
    const item = cartItems.items.find((i) => i._id === id);
    if (item && item.quantity > 1) {
      await updateProductToCart({ ...item, quantity: item.quantity - 1 });
    } else {
      await removeFromCart(id);
    }
  };

  const clearCart = () => {
    setCartItems({ items: [], customCoils: [] });
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    const item = cartItems.items.find((i) => i._id === itemId);
    if (item) {
      await updateProductToCart({ ...item, quantity });
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/addCustomCoil`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            ...(user?.token ? { "Authorization": `Bearer ${user.token}` } : {})
          },
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/removeCustomCoil`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            ...(user?.token ? { "Authorization": `Bearer ${user.token}` } : {})
          },
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

  return (
    <CartContext.Provider value={{ cartItems, setAllToCart, addToCart, addCustomCoilToCart, updateCustomCoilToCart, decrementToCart, removeFromCart, updateProductToCart, removeCustomCoilFromCart, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}