export default function About(){
  return (
    <main className="section">
      <div className="container">
        <div className="grid2">
          <div className="card" data-reveal>
            <h1 className="h2">Meet Your Esthetician</h1>
            <p className="muted">I'm Morgan James.</p>

                        <div className="rich">
              <p>
                I'm Morgan James. I have a hilarious 6 y/o son and a amazing partner that I adore. I graduated from Jenks Beauty College in 2022 and became a licensed esthetician through the Oklahoma State Board of Cosmetology shortly after.
              </p>

              <p>
                I became an esthetician because I personally struggled with cystic acne and post-inflammatory hyperpigmentation. (I understand how unhappy you can feel in your own skin at times). After a few years of trial and error, numerous 14 days magical fixes, giving up, an esthetician, and two dermatologist later. I was finally able to find a routine that worked for me.
              </p>

              <p>
                After the worst parts of my acne challenges, I knew I was not the only one facing these issues in my community. I wanted to help others improve their skin! So, I enrolled in the esthetician program at Jenks Beauty College. While in college not only did I learn new techniques for the skin, but I also discovered a passion for eyebrows and body waxing.
              </p>

              <p>
                I look forward to meeting you!
              </p>

              <p className="signature">— Your Esthetician, Morgan</p>
            </div>
          </div>

          <div className="card card--media" data-reveal>
            <img className="media__img" src="/images/content/morgan.jpeg" alt="Morgan smiling outdoors" />
            <div className="media__caption">
              <div className="media__title">Dreamy Esthetics</div>
              <div className="media__sub">Luxury spa experience • Tulsa, OK</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
