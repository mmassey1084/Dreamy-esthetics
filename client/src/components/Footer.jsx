export default function Footer(){
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="footer__title">Dreamy Esthetics LLC</div>
          <div className="footer__sub">Luxury spa experience • Brows • Waxing • Facials</div>
        </div>
        <div className="footer__fineprint">© {new Date().getFullYear()} Dreamy Esthetics. All rights reserved.</div>
      </div>
    </footer>
  );
}
