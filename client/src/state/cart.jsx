import React, { createContext, useContext, useMemo, useReducer } from "react";

function keyOf(item){
  return `${item.group}::${item.name}`;
}

function reducer(state, action){
  switch(action.type){
    case "ADD": {
      const key = keyOf(action.item);
      const next = { ...state.items };
      const existing = next[key];
      if (existing) next[key] = { ...existing, qty: existing.qty + 1 };
      else next[key] = { ...action.item, qty: 1 };
      return { ...state, items: next };
    }
    case "DECREMENT": {
      const key = action.key;
      const next = { ...state.items };
      const existing = next[key];
      if (!existing) return state;
      if (existing.qty <= 1) delete next[key];
      else next[key] = { ...existing, qty: existing.qty - 1 };
      return { ...state, items: next };
    }
    case "REMOVE": {
      const next = { ...state.items };
      delete next[action.key];
      return { ...state, items: next };
    }
    case "CLEAR":
      return { ...state, items: {} };
    case "SET_OPEN":
      return { ...state, isOpen: action.value };
    default:
      return state;
  }
}

const CartContext = createContext(null);

export function CartProvider({ children }){
  const [state, dispatch] = useReducer(reducer, { items: {}, isOpen: false });

  const api = useMemo(() => {
    const list = Object.entries(state.items).map(([key, item]) => ({ key, ...item }));
    const subtotal = list.reduce((sum, it) => sum + (Number(it.price) || 0) * it.qty, 0);
    const count = list.reduce((sum, it) => sum + it.qty, 0);

    return {
      isOpen: state.isOpen,
      items: list,
      subtotal,
      count,
      add: (item) => dispatch({ type: "ADD", item }),
      decrement: (key) => dispatch({ type: "DECREMENT", key }),
      remove: (key) => dispatch({ type: "REMOVE", key }),
      clear: () => dispatch({ type: "CLEAR" }),
      open: () => dispatch({ type: "SET_OPEN", value: true }),
      close: () => dispatch({ type: "SET_OPEN", value: false }),
      toggle: () => dispatch({ type: "SET_OPEN", value: !state.isOpen }),
    };
  }, [state.items, state.isOpen]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart(){
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
