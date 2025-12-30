import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import "../styles/globals.css";
import { CartProvider } from "../state/cart.jsx";

export default function App(){
  return (
    <BrowserRouter>
      <CartProvider>
        <Router />
      </CartProvider>
    </BrowserRouter>
  );
}
