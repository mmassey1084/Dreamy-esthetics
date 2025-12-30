import { NavLink } from "react-router-dom";
import { useCart } from "../state/cart.jsx";

export default function Navbar({ variant = "solid" }){
  const cart = useCart();

  return (
    <header className={`nav ${variant === "overlay" ? "nav--overlay" : "nav--solid"}`}>
      <div className="nav__inner">
        <div className="nav__brand">
          <img className="nav__logo" src="/images/brand/logo.png" alt="Dreamy Esthetics logo" />
          <span className="nav__name">Dreamy Esthetics</span>
        </div>

        <nav className="nav__links" aria-label="Primary navigation">
          <NavLink to="/" className={({isActive}) => `nav__link ${isActive ? "is-active" : ""}`}>Home</NavLink>
          <NavLink to="/policy" className={({isActive}) => `nav__link ${isActive ? "is-active" : ""}`}>Policy</NavLink>
          <NavLink to="/booking" className={({isActive}) => `nav__link ${isActive ? "is-active" : ""}`}>Booking</NavLink>
          <NavLink to="/gift-card" className={({isActive}) => `nav__link ${isActive ? "is-active" : ""}`}>Gift Card</NavLink>
          <NavLink to="/about" className={({isActive}) => `nav__link ${isActive ? "is-active" : ""}`}>About Me</NavLink>
          <NavLink to="/book-plus" className={({isActive}) => `nav__link ${isActive ? "is-active" : ""}`}>Book Plus</NavLink>
        </nav>

        <div className="nav__actions">
          <button className="iconbtn iconbtn--cart" onClick={cart.open} aria-label="Open cart">
            🛍️
            {cart.count > 0 && <span className="badge">{cart.count}</span>}
          </button>
          <NavLink to="/booking" className="btn btn--primary">Book</NavLink>
        </div>
      </div>
    </header>
  );
}
