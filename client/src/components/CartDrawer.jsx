import { useEffect, useMemo, useState } from "react";
import { useCart } from "../state/cart.jsx";
import { postJSON } from "../lib/api";

function formatMoney(n){
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);
}

function validateCheckout(values){
  const errors = {};
  if (!values.fullName || values.fullName.trim().length < 2) errors.fullName = "Full name is required.";
  if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Valid email is required.";
  if (!values.phone || !/^\+?[0-9()\-\s]{7,}$/.test(values.phone)) errors.phone = "Valid phone is required.";
  return errors;
}

export default function CartDrawer(){
  const cart = useCart();
  const [values, setValues] = useState({ fullName: "", email: "", phone: "", notes: "" });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const errors = useMemo(() => validateCheckout(values), [values]);
  const hasErrors = Object.keys(errors).length > 0;

  useEffect(() => {
    function onKey(e){ if (e.key === "Escape") cart.close(); }
    if (cart.isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cart.isOpen]);

  const onChange = (e) => setValues(v => ({ ...v, [e.target.name]: e.target.value }));
  const mark = (name) => setTouched(t => ({ ...t, [name]: true }));

  const checkout = async (e) => {
    e.preventDefault();
    setTouched({ fullName: true, email: true, phone: true });
    if (hasErrors) {
      setStatus({ state: "error", message: "Please fix the highlighted fields." });
      return;
    }
    if (cart.items.length === 0) {
      setStatus({ state: "error", message: "Your cart is empty." });
      return;
    }
    setStatus({ state: "loading", message: "Processing..." });
    try{
      const payload = {
        customer: { fullName: values.fullName.trim(), email: values.email.trim(), phone: values.phone.trim() },
        notes: (values.notes || "").trim(),
        items: cart.items.map(i => ({ name: i.name, group: i.group, price: i.price, qty: i.qty }))
      };
      const res = await postJSON("/api/checkout", payload);
      setStatus({ state: "success", message: `Success! Order #${res.orderId} created.` });
      cart.clear();
    }catch(err){
      setStatus({ state: "error", message: err.message || "Checkout failed." });
    }
  };

  return (
    <>
      <div className={`drawer__backdrop ${cart.isOpen ? "is-open" : ""}`} onClick={cart.close} />
      <aside className={`drawer ${cart.isOpen ? "is-open" : ""}`} aria-hidden={!cart.isOpen}>
        <div className="drawer__header">
          <div>
            <div className="drawer__title">Your Cart</div>
            <div className="drawer__sub">{cart.count} item(s) • {formatMoney(cart.subtotal)}</div>
          </div>
          <button className="iconbtn" onClick={cart.close} aria-label="Close cart">✕</button>
        </div>

        <div className="drawer__content">
          {cart.items.length === 0 ? (
            <div className="empty">
              <div className="empty__title">Nothing here yet</div>
              <div className="empty__text">Add services from the Booking page.</div>
            </div>
          ) : (
            <ul className="cartlist" role="list">
              {cart.items.map(item => (
                <li className="cartitem" key={item.key}>
                  <div className="cartitem__meta">
                    <div className="cartitem__name">{item.name}</div>
                    <div className="cartitem__sub">{item.group} • {formatMoney(item.price)}</div>
                  </div>
                  <div className="cartitem__actions">
                    <button className="qtybtn" onClick={() => cart.decrement(item.key)} aria-label="Decrease quantity">−</button>
                    <span className="qty">{item.qty}</span>
                    <button className="qtybtn" onClick={() => cart.add(item)} aria-label="Increase quantity">+</button>
                    <button className="linkbtn" onClick={() => cart.remove(item.key)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="divider" />

          <form className="form" onSubmit={checkout} noValidate>
            <div className="h3">Checkout Details</div>

            <label className="field">
              <span className="field__label">Full Name</span>
              <input className={`input ${touched.fullName && errors.fullName ? "input--error" : ""}`} name="fullName" value={values.fullName} onChange={onChange} onBlur={() => mark("fullName")} required />
              {touched.fullName && errors.fullName && <span className="field__error">{errors.fullName}</span>}
            </label>

            <label className="field">
              <span className="field__label">Email</span>
              <input className={`input ${touched.email && errors.email ? "input--error" : ""}`} name="email" type="email" value={values.email} onChange={onChange} onBlur={() => mark("email")} required />
              {touched.email && errors.email && <span className="field__error">{errors.email}</span>}
            </label>

            <label className="field">
              <span className="field__label">Phone</span>
              <input className={`input ${touched.phone && errors.phone ? "input--error" : ""}`} name="phone" value={values.phone} onChange={onChange} onBlur={() => mark("phone")} required />
              {touched.phone && errors.phone && <span className="field__error">{errors.phone}</span>}
            </label>

            <label className="field">
              <span className="field__label">Notes (optional)</span>
              <textarea className="input input--textarea" name="notes" value={values.notes} onChange={onChange} />
            </label>

            <div className="notice">
              <div className="notice__row">
                <span>Subtotal</span>
                <strong>{formatMoney(cart.subtotal)}</strong>
              </div>
              <div className="muted" style={{ marginTop: ".35rem" }}>
                Demo checkout (no payment gateway). Your server receives the order and returns an order ID.
              </div>
            </div>

            <div className="form__actions">
              <button className="btn btn--primary" type="submit" disabled={status.state === "loading"}>
                {status.state === "loading" ? "Processing..." : "Place Order"}
              </button>
              <button className="btn btn--ghost" type="button" onClick={cart.clear}>Clear</button>
            </div>

            {status.state !== "idle" && (
              <div className={`notice ${status.state === "success" ? "notice--success" : status.state === "error" ? "notice--error" : ""}`}>
                {status.message}
              </div>
            )}
          </form>
        </div>
      </aside>
    </>
  );
}
