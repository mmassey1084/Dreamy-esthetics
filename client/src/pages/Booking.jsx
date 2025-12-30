import { useMemo, useState } from "react";
import { services, serviceOptions } from "../data/services";
import { useCart } from "../state/cart.jsx";
import { postJSON } from "../lib/api";

function formatMoney(n){
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);
}

function validateBooking(values){
  const errors = {};
  if (!values.fullName || values.fullName.trim().length < 2) errors.fullName = "Full name is required.";
  if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = "Valid email is required.";
  if (!values.phone || !/^\+?[0-9()\-\s]{7,}$/.test(values.phone)) errors.phone = "Valid phone is required.";
  if (!values.date) errors.date = "Please select a date.";
  if (!values.time) errors.time = "Please select a time.";
  if (!values.service) errors.service = "Please select a service.";
  return errors;
}

export default function Booking(){
  const cart = useCart();

  const [values, setValues] = useState({
    fullName: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    notes: ""
  });

  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const errors = useMemo(() => validateBooking(values), [values]);
  const hasErrors = Object.keys(errors).length > 0;

  const onChange = (e) => setValues(v => ({ ...v, [e.target.name]: e.target.value }));
  const mark = (name) => setTouched(t => ({ ...t, [name]: true }));

  const submit = async (e) => {
    e.preventDefault();
    setTouched({ fullName: true, email: true, phone: true, service: true, date: true, time: true });
    if (hasErrors) {
      setStatus({ state: "error", message: "Please fix the highlighted fields." });
      return;
    }

    setStatus({ state: "loading", message: "Sending..." });
    try{
      const payload = {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        service: values.service,
        date: values.date,
        time: values.time,
        notes: values.notes.trim(),
        cartItems: cart.items.map(i => ({ name: i.name, group: i.group, price: i.price, qty: i.qty }))
      };
      await postJSON("/api/booking", payload);
      setStatus({ state: "success", message: "Request sent! You’ll receive confirmation soon." });
      setValues(v => ({ ...v, notes: "" }));
    }catch(err){
      setStatus({ state: "error", message: err.message || "Booking failed." });
    }
  };

  return (
    <main className="section">
      <div className="container">
        <div className="section__head" data-reveal>
          <h1 className="h2">Booking</h1>
          <p className="muted">Browse services, add to cart, and request your appointment. (Cart checkout is separate.)</p>
        </div>

        <div className="grid3 booking-layout">
          <div className="card" data-reveal>
            <h2 className="h3">Services</h2>
            <p className="muted">Tap “Add to Cart” to purchase, or select a service to book.</p>

            <div className="services">
              {Object.entries(services).map(([group, items]) => (
                <div className="card services__group" key={group}>
                  <div className="services__title">{group}</div>
                  <ul className="services__list" role="list">
                    {items.map(([name, price, duration, description]) => (
                      <li className="services__item" key={name}>
                        <div className="services__left">
                          <div className="services__name">{name}</div>
                          <div className="services__meta">
                            <span>{duration} min</span>
                            {description ? <span className="dot">•</span> : null}
                            {description ? <span className="services__desc">{description}</span> : null}
                          </div>
                        </div>
                        <div className="services__right">
                          <div className="services__price">{formatMoney(price)}</div>
                          <button
                            className="btn btn--small btn--ghost"
                            type="button"
                            onClick={() => cart.add({ group, name, price })}
                            aria-label={`Add ${name} to cart`}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="divider" />
            <div className="ctaRow">
              <button className="btn btn--primary" onClick={cart.open}>Open Cart</button>
              <a className="btn btn--ghost" href="/policy">Read Policy</a>
            </div>
          </div>

          <div className="card" data-reveal>
            <h2 className="h3">Request an Appointment</h2>
            <p className="muted">Client + server validation included. Your request is sent to the Node server.</p>

            <form className="form" onSubmit={submit} noValidate>
              <div className="form__row">
                <label className="field">
                  <span className="field__label">Full Name</span>
                  <input className={`input ${touched.fullName && errors.fullName ? "input--error" : ""}`} name="fullName" value={values.fullName} onChange={onChange} onBlur={() => mark("fullName")} required />
                  {touched.fullName && errors.fullName && <span className="field__error">{errors.fullName}</span>}
                </label>

                <label className="field">
                  <span className="field__label">Phone</span>
                  <input className={`input ${touched.phone && errors.phone ? "input--error" : ""}`} name="phone" value={values.phone} onChange={onChange} onBlur={() => mark("phone")} required />
                  {touched.phone && errors.phone && <span className="field__error">{errors.phone}</span>}
                </label>
              </div>

              <label className="field">
                <span className="field__label">Email</span>
                <input className={`input ${touched.email && errors.email ? "input--error" : ""}`} name="email" type="email" value={values.email} onChange={onChange} onBlur={() => mark("email")} required />
                {touched.email && errors.email && <span className="field__error">{errors.email}</span>}
              </label>

              <label className="field">
                <span className="field__label">Service</span>
                <select className={`input ${touched.service && errors.service ? "input--error" : ""}`} name="service" value={values.service} onChange={onChange} onBlur={() => mark("service")} required>
                  <option value="">Select a service…</option>
                  {serviceOptions.map((s) => (
                    <option key={`${s.group}-${s.name}`} value={`${s.group}: ${s.name} (${formatMoney(s.price)})`}>
                      {s.group} — {s.name} ({formatMoney(s.price)})
                    </option>
                  ))}
                </select>
                {touched.service && errors.service && <span className="field__error">{errors.service}</span>}
              </label>

              <div className="form__row">
                <label className="field">
                  <span className="field__label">Preferred Date</span>
                  <input className={`input ${touched.date && errors.date ? "input--error" : ""}`} name="date" type="date" value={values.date} onChange={onChange} onBlur={() => mark("date")} required />
                  {touched.date && errors.date && <span className="field__error">{errors.date}</span>}
                </label>

                <label className="field">
                  <span className="field__label">Preferred Time</span>
                  <input className={`input ${touched.time && errors.time ? "input--error" : ""}`} name="time" type="time" value={values.time} onChange={onChange} onBlur={() => mark("time")} required />
                  {touched.time && errors.time && <span className="field__error">{errors.time}</span>}
                </label>
              </div>

              <label className="field">
                <span className="field__label">Notes (optional)</span>
                <textarea className="input input--textarea" name="notes" value={values.notes} onChange={onChange} />
              </label>

              {cart.items.length > 0 && (
                <div className="notice">
                  <strong>Cart attached to request:</strong>
                  <div className="muted" style={{ marginTop: ".35rem" }}>
                    {cart.items.map(i => `${i.name} ×${i.qty}`).join(", ")}
                  </div>
                </div>
              )}

              <div className="form__actions">
                <button className="btn btn--primary" type="submit" disabled={status.state === "loading"}>
                  {status.state === "loading" ? "Sending..." : "Submit Booking Request"}
                </button>
                <button className="btn btn--ghost" type="button" onClick={cart.open}>Checkout Cart</button>
              </div>

              {status.state !== "idle" && (
                <div className={`notice ${status.state === "success" ? "notice--success" : status.state === "error" ? "notice--error" : ""}`}>
                  {status.message}
                </div>
              )}
            </form>
          </div>

          <div className="card card--glow" data-reveal>
            <h2 className="h3">Dreamy Services Menu</h2>
            <p className="muted">Reference menu image you provided.</p>
            <img className="img" src="/images/content/services-menu.png" alt="Dreamy Services price menu" />
            <div className="divider" />
            <p className="muted">Need help choosing? Add a note in your booking request and Morgan will guide you.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
