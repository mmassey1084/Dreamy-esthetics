import { Link } from "react-router-dom";
import Gallery from "../components/Gallery";
import { galleryImages, galleryCategories } from "../data/galleryAuto";

export default function Home() {
  const scrollToGallery = () => {
    const el = document.getElementById("gallery");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main>
      {/* HERO */}
      <section className="hero" aria-label="Dreamy Esthetics hero section">
        {/* Decorative backgrounds */}
        <div className="hero__bg" aria-hidden="true" />
        <div className="hero__overlay" aria-hidden="true" />

        <div className="container hero__inner">
          <div className="hero__copy" data-reveal>
            {/* Decorative label */}
            <div className="pill" aria-hidden="true">
              Brows • Waxing • Facials
            </div>

            <h1 className="h1">Dreamy Esthetics</h1>

            <p className="lead">
              My ultimate goal at Dreamy is to help my clients find balance,
              comfort, and confidence in their own skin — no matter the treatment.
            </p>

            {/* CTA buttons */}
            <div className="hero__cta">
              <Link className="btn btn--primary" to="/booking">
                Book Appointment
              </Link>

              <button
                className="btn btn--ghost"
                type="button"
                onClick={scrollToGallery}
                aria-label="Scroll to the gallery section"
              >
                View Gallery
              </button>

              <Link className="btn btn--ghost" to="/gift-card">
                Gift Card
              </Link>
            </div>

            {/* Stats are informational — keep accessible */}
            <div className="hero__stats" aria-label="Highlights">
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

      {/* WELCOME SECTION */}
      <section className="section section--soft" aria-label="Welcome section">
        <div className="container">
          <div className="grid2">
            <div className="card" data-reveal>
              <h2 className="h2">Welcome to Dreamy Esthetics!</h2>

              <div className="rich">
                <p>
                  I created this beautiful space to give women in my community
                  the luxury spa experience. So please come as you are and let
                  me pamper you!
                </p>
                <p className="signature">— Your Esthetician, Morgan</p>
              </div>

              <div className="card__actions" aria-label="Welcome actions">
                <Link className="btn btn--primary" to="/booking">
                  Explore Services
                </Link>
                <Link className="btn btn--ghost" to="/about">
                  Meet Morgan
                </Link>
              </div>
            </div>

            {/* VIDEO */}
            <section className="section" aria-label="Featured video section">
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
                      title="Dreamy Esthetics promotional video"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* QUICK LINKS */}
            <div className="card card--glow" data-reveal>
              <h3 className="h3">Quick Links</h3>

              <ul className="checklist">
                <li>Read the booking policy before scheduling.</li>
                <li>Request your appointment in minutes.</li>
                <li>Use gift cards for any service.</li>
              </ul>

              <div className="divider" aria-hidden="true" />

              <div className="card__actions" aria-label="Quick links">
                <Link className="btn btn--ghost" to="/policy">
                  Policy
                </Link>
                <Link className="btn btn--ghost" to="/gift-card">
                  Gift Card
                </Link>
                <Link className="btn btn--ghost" to="/book-plus">
                  Book Plus
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES IMAGE */}
      <section className="section" aria-label="Services list section">
        <div className="container">
          <div className="card" data-reveal>
            <h2 className="h2">Dreamy Service List</h2>
            <p className="muted">
              A quick look at popular services and starting prices. For details
              and booking, visit the Booking page.
            </p>

            <div className="media media--flat">
              <img
                className="media__img media__img--contain"
                src="/images/content/services-menu.png"
                alt="Dreamy Esthetics service menu with prices"
              />
            </div>

            <div className="card__actions" aria-label="Service list actions">
              <Link className="btn btn--primary" to="/booking">
                Book Now
              </Link>
              <Link className="btn btn--ghost" to="/policy">
                Read Policy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" aria-label="Photo gallery section">
        <Gallery
          images={galleryImages}
          categories={galleryCategories}
          title="Dreamy Gallery"
        />
      </section>
    </main>
  );
}
