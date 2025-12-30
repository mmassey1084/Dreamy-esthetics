import Gallery from "../components/Gallery";
import { galleryImages, galleryCategories } from "../data/galleryAuto";

export default function Home(){
  const scrollToGallery = () => {
    const el = document.getElementById("gallery");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main>
      <section className="hero">
        <div className="hero__bg" aria-hidden="true" />
        <div className="hero__overlay" aria-hidden="true" />
        <div className="container hero__inner">
          <div className="hero__copy" data-reveal>
            <div className="pill">Brows • Waxing • Facials</div>
            <h1 className="h1">Dreamy Esthetics</h1>
            <p className="lead">
              My ultimate goal at Dreamy is to help my clients find balance, comfort, and confidence in their own skin — no matter the treatment.
            </p>
            <div className="hero__cta">
              <a className="btn btn--primary" href="/booking">Book Appointment</a>
              <button className="btn btn--ghost" type="button" onClick={scrollToGallery}>View Gallery</button>
              <a className="btn btn--ghost" href="/gift-card">Gift Card</a>
            </div>

            <div className="hero__stats">
              <div className="stat">
                <div className="stat__kicker">Specialties</div>
                <div className="stat__value">Brows + Waxing</div>
              </div>
              <div className="stat">
                <div className="stat__kicker">Also Offering</div>
                <div className="stat__value">Facials + Dermaplane</div>
              </div>
              <div className="stat">
                <div className="stat__kicker">Experience</div>
                <div className="stat__value">Luxury + Comfort</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="grid2">
            <div className="card" data-reveal>
              <h2 className="h2">Welcome to Dreamy Esthetics!</h2>
              <div className="rich">
                <p>
                  I created this beautiful space to give women in my community the luxury spa experience. So please come as you are and let me pamper you!
                </p>
                <p className="signature">— Your Esthetician, Morgan</p>
              </div>
              <div className="card__actions">
                <a className="btn btn--primary" href="/booking">Explore Services</a>
                <a className="btn btn--ghost" href="/about">Meet Morgan</a>
              </div>
            </div>
            <section className="section">
        <div className="container">
          <div className="card" data-reveal>
            <h2 className="h2">Featured Video</h2>
            <p className="muted">A quick look at Dreamy Esthetics in action.</p>

            <div className="videoEmbed">
              <iframe
                src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2FDreamyEstheticsLLC%2Fvideos%2F634444362520046%2F&show_text=false&width=267&t=0"
                width="267"
                height="476"
                style={{ border: "none", overflow: "hidden" }}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                title="Dreamy Esthetics Video"
              />
            </div>
          </div>
        </div>
      </section>
            <div className="card card--glow" data-reveal>
              <h3 className="h3">Quick Links</h3>
              <ul className="checklist">
                <li>Read the booking policy before scheduling.</li>
                <li>Request your appointment in minutes.</li>
                <li>Use gift cards for any service.</li>
              </ul>
              <div className="divider" />
              <div className="card__actions">
                <a className="btn btn--ghost" href="/policy">Policy</a>
                <a className="btn btn--ghost" href="/gift-card">Gift Card</a>
                <a className="btn btn--ghost" href="/book-plus">Book Plus</a>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="section">
        <div className="container">
          <div className="card" data-reveal>
            <h2 className="h2">Dreamy Service List</h2>
            <p className="muted">A quick look at popular services and starting prices. For details and booking, visit the Booking page.</p>
            <div className="media media--flat">
              <img className="media__img media__img--contain" src="/images/content/services-menu.png" alt="Dreamy services menu" />
            </div>
            <div className="card__actions">
              <a className="btn btn--primary" href="/booking">Book Now</a>
              <a className="btn btn--ghost" href="/policy">Read Policy</a>
            </div>
          </div>
        </div>
      </section>

      <div id="gallery">
        <Gallery images={galleryImages} categories={galleryCategories} title="Dreamy Gallery" />
      </div>
    </main>
  );
}
