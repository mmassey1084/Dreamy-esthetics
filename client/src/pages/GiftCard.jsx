import { useMemo, useState } from "react";
import { postJSON } from "../lib/api";

function validate(values){
  const errors = {};
  if (!values.fromName || values.fromName.trim().length < 2) errors.fromName = "Your name is required.";
  if (!values.toName || values.toName.trim().length < 2) errors.toName = "Recipient name is required.";
  if (!values.toEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.toEmail)) errors.toEmail = "Valid recipient email is required.";
  const amt = Number(values.amount);
  if (!amt || amt < 10 || amt > 1000) errors.amount = "Amount must be between $10 and $1000.";
  if ((values.message || "").length > 240) errors.message = "Message must be 240 characters or less.";
  return errors;
}

export default function GiftCard(){
  const [values, setValues] = useState({ fromName: "", toName: "", toEmail: "", amount: 50, message: "" });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState({ state: "idle", message: "" });

  const errors = useMemo(() => validate(values), [values]);
  const hasErrors = Object.keys(errors).length > 0;

  const onChange = (e) => setValues(v => ({ ...v, [e.target.name]: e.target.value }));
  const mark = (name) => setTouched(t => ({ ...t, [name]: true }));

  const submit = async (e) => {
    e.preventDefault();
    setTouched({ fromName: true, toName: true, toEmail: true, amount: true });
    if (hasErrors) {
      setStatus({ state: "error", message: "Please fix the highlighted fields." });
      return;
    }
    setStatus({ state: "loading", message: "Sending..." });
    try{
      await postJSON("/api/gift-card", {
        fromName: values.fromName.trim(),
        toName: values.toName.trim(),
        toEmail: values.toEmail.trim(),
        amount: Number(values.amount),
        message: (values.message || "").trim()
      });
      setStatus({ state: "success", message: "Gift card request sent! (Demo endpoint)" });
    }catch(err){
      setStatus({ state: "error", message: err.message || "Gift card failed." });
    }
  };

  return (
    <main className="section">
      <div className="container">
        <div className="grid2">
          <div className="card" data-reveal>
            <h1 className="h2">Gift Cards</h1>
            <p className="muted">A perfect treat for someone you love. This form sends to the Node server.</p>

            <form className="form" onSubmit={submit} noValidate>
              <div className="form__row">
                <label className="field">
                  <span className="field__label">From</span>
                  <input className={`input ${touched.fromName && errors.fromName ? "input--error" : ""}`} name="fromName" value={values.fromName} onChange={onChange} onBlur={() => mark("fromName")} />
                  {touched.fromName && errors.fromName && <span className="field__error">{errors.fromName}</span>}
                </label>
                <label className="field">
                  <span className="field__label">To</span>
                  <input className={`input ${touched.toName && errors.toName ? "input--error" : ""}`} name="toName" value={values.toName} onChange={onChange} onBlur={() => mark("toName")} />
                  {touched.toName && errors.toName && <span className="field__error">{errors.toName}</span>}
                </label>
              </div>

              <label className="field">
                <span className="field__label">Recipient Email</span>
                <input className={`input ${touched.toEmail && errors.toEmail ? "input--error" : ""}`} name="toEmail" type="email" value={values.toEmail} onChange={onChange} onBlur={() => mark("toEmail")} />
                {touched.toEmail && errors.toEmail && <span className="field__error">{errors.toEmail}</span>}
              </label>

              <label className="field">
                <span className="field__label">Amount</span>
                <input className={`input ${touched.amount && errors.amount ? "input--error" : ""}`} name="amount" type="number" min="10" max="1000" value={values.amount} onChange={onChange} onBlur={() => mark("amount")} />
                {touched.amount && errors.amount && <span className="field__error">{errors.amount}</span>}
              </label>

              <label className="field">
                <span className="field__label">Message (optional)</span>
                <textarea className={`input input--textarea ${touched.message && errors.message ? "input--error" : ""}`} name="message" value={values.message} onChange={onChange} onBlur={() => mark("message")} maxLength={240} />
                {touched.message && errors.message && <span className="field__error">{errors.message}</span>}
                <div className="muted" style={{ marginTop: ".35rem" }}>{(values.message || "").length}/240</div>
              </label>

              <div className="form__actions">
                <button className="btn btn--primary" type="submit" disabled={status.state === "loading"}>
                  {status.state === "loading" ? "Sending..." : "Send Gift Card"}
                </button>
              </div>

              {status.state !== "idle" && (
                <div className={`notice ${status.state === "success" ? "notice--success" : status.state === "error" ? "notice--error" : ""}`}>
                  {status.message}
                </div>
              )}
            </form>
          </div>

          <div className="card card--glow" data-reveal>
            <h2 className="h3">How it works</h2>
            <ol className="steps">
              <li>Choose an amount (usable for any Dreamy service).</li>
              <li>Add a message and recipient email.</li>
              <li>Submit — your request is sent to the server.</li>
            </ol>
            <div className="divider" />
            <p className="muted">Want to buy specific services instead? Use the cart from the Booking page.</p>
            <a className="btn btn--ghost" href="/booking">Go to Booking</a>
          </div>
        </div>
      </div>
    </main>
  );
}
