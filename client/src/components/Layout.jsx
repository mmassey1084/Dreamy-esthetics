import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import useRevealOnScroll from "./useRevealOnScroll";
import CartDrawer from "./CartDrawer";

export default function Layout(){
  useRevealOnScroll();
const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div className="app">
      <Navbar variant={isHome ? "overlay" : "solid"} />
      <CartDrawer />
      <Outlet />
      <Footer />
    </div>
  );
}