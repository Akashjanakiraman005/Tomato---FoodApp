import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { food_list as fallbackFoodList } from "../assets/assets";

export const StoreContext = createContext(null);

const getFallbackFoods = () => {
    return fallbackFoodList.map((item) => ({
        ...item,
        image: `food_${item._id}.png`,
    }));
};

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = import.meta.env.VITE_API_URL || "http://localhost:4000";
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const clearAuthState = () => {
        localStorage.removeItem("token");
        setToken("");
        setCartItems({});
    };

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        if(token){
           try {
                await axios.post(url+"/api/cart/add", { itemId }, {
                    headers:{token}
                });
           } catch (error) {
                if (error?.response?.status === 401) {
                    clearAuthState();
                }
           }
        }
    };

    const removeFromCart = async(itemId) => {
        setCartItems((prev) => {
            const current = prev[itemId] || 0;
            const nextCount = current - 1;
            if (nextCount <= 0) {
                const { [itemId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [itemId]: nextCount };
        });
        if(token){
            try {
                await axios.post(url+"/api/cart/remove", { itemId }, {
                    headers:{token}
                });
            } catch (error) {
                if (error?.response?.status === 401) {
                    clearAuthState();
                }
            }
        }
    };
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                }
            }
        }
        return totalAmount;
    }


    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url+"/api/food/list");
            if (response.data.success && response.data.data.length > 0) {
                setFoodList(response.data.data);
            } else {
                setFoodList(getFallbackFoods());
            }
        } catch (error) {
            console.error("Failed to fetch food list, using fallback:", error);
            setFoodList(getFallbackFoods());
        }
    }
    
    const loadCartData = async (token) => {
        try {
            const response = await axios.get(url+"/api/cart/get", {
                headers: { token }
            });
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            if (error?.response?.status === 401) {
                clearAuthState();
            }
            console.error("Error loading cart:", error);
        }
    }
    
    useEffect(() => {
        async function loadData(){
            await fetchFoodList();
            if(localStorage.getItem("token")){
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    }, []);

   


    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        searchTerm,
        setSearchTerm
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;