function homepage({ sms, phone, tel, email }) {
  return `<section class="home-hero" id="home">
  <div class="container home-hero-grid">
    <div class="home-hero-copy reveal">
      <p class="eyebrow">Junk Removal &bull; Alexandria, LA</p>
      <h1>Junk Removal in Alexandria &amp; Central Louisiana</h1>
      <p class="home-hero-lead">Property cleanouts, furniture removal, and junk hauling. Send photos for a fast estimate.</p>
      <div class="button-row home-hero-actions">
        <a class="btn btn-primary" href="${sms}">&#128247; Text Photos for Quote</a>
        <a class="btn btn-outline" href="tel:${tel}">Call ${phone}</a>
      </div>
      <ul class="trust-row" aria-label="Service highlights"><li>Owner Operated</li><li>Local Service</li><li>Straightforward Pricing</li></ul>
    </div>
    <figure class="hero-job-photo reveal">
      <img src="/assets/images/cook-ave/cook-ave-living-room-after.webp" width="1152" height="1536" fetchpriority="high" alt="Living room cleared after a Clear Path property cleanout in Alexandria Louisiana">
      <figcaption><span>Real local result</span> Alexandria property cleanout</figcaption>
    </figure>
  </div>
</section>

<aside class="local-strip" id="about" aria-label="Clear Path service area">
  <div class="container local-strip-inner"><p><strong>Serving</strong> Alexandria <span>&bull;</span> Pineville <span>&bull;</span> Ball <span>&bull;</span> Tioga <span>&bull;</span> Central Louisiana</p><a href="/service-areas/">View Service Area <span aria-hidden="true">&rarr;</span></a></div>
</aside>

<section class="section results-section" id="results">
  <div class="container">
    <div class="section-head compact-head">
      <p class="eyebrow">Real Local Work</p>
      <h2>Alexandria Property Cleanout</h2>
      <p>Full-property cleanout completed in Alexandria, Louisiana.</p>
    </div>
    <div class="result-pair reveal">
      <figure><span class="photo-label">Before</span><img src="/assets/images/cook-ave/cook-ave-kitchen-wide-before.webp" width="1152" height="1536" loading="lazy" alt="Kitchen before an Alexandria property cleanout with household debris covering the floor"></figure>
      <figure><span class="photo-label after">After</span><img src="/assets/images/cook-ave/cook-ave-kitchen-wide-after.webp" width="1152" height="1536" loading="lazy" alt="Same Alexandria kitchen after Clear Path removed the household debris"></figure>
    </div>
    <p class="center-link"><a class="learn-more" href="/projects/alexandria-duplex-cleanout/">View Full Project</a></p>
  </div>
</section>

<section class="section gray" id="services">
  <div class="container">
    <div class="section-head compact-head"><p class="eyebrow">Services</p><h2>What we haul</h2></div>
    <div class="haul-grid">
      <a class="haul-card" href="/services/property-cleanouts/"><span class="haul-icon">01</span><h3>Property Cleanouts</h3><p>Rentals, estates, move-outs, and full-property cleanouts.</p><span class="card-arrow">&rarr;</span></a>
      <a class="haul-card" href="/services/furniture-removal/"><span class="haul-icon">02</span><h3>Furniture &amp; Appliances</h3><p>Couches, mattresses, tables, washers, dryers, and bulky items.</p><span class="card-arrow">&rarr;</span></a>
      <a class="haul-card" href="/services/"><span class="haul-icon">03</span><h3>Household Junk</h3><p>Boxes, clutter, broken items, and unwanted household contents.</p><span class="card-arrow">&rarr;</span></a>
      <a class="haul-card" href="/services/yard-debris-removal/"><span class="haul-icon">04</span><h3>Yard &amp; Outdoor Debris</h3><p>Brush, bagged debris, and non-hazardous outdoor cleanup.</p><span class="card-arrow">&rarr;</span></a>
    </div>
    <p class="center-link"><a class="learn-more" href="/services/">View All Services</a></p>
  </div>
</section>

<section class="section process-section">
  <div class="container">
    <div class="section-head compact-head"><p class="eyebrow">How It Works</p><h2>Photos to cleared space.</h2></div>
    <div class="compact-steps">
      <article><span>1</span><div><h3>Send Photos</h3><p>Text photos of what needs to go.</p></div></article>
      <article><span>2</span><div><h3>Get Your Quote</h3><p>Receive a straightforward estimate.</p></div></article>
      <article><span>3</span><div><h3>We Haul It</h3><p>We load it, remove it, and clear the space.</p></div></article>
    </div>
  </div>
</section>

<section class="section dark work-preview" id="recent-work">
  <div class="container">
    <div class="section-head compact-head"><p class="eyebrow">Recent Work</p><h2>Real rooms. Real results.</h2></div>
    <div class="work-photo-grid">
      <figure><span class="photo-label">Living Room &bull; Before</span><img src="/assets/images/cook-ave/cook-ave-living-room-before.webp" width="1152" height="1536" loading="lazy" alt="Living room before an Alexandria property cleanout with household debris on the floor"></figure>
      <figure><span class="photo-label after">Living Room &bull; After</span><img src="/assets/images/cook-ave/cook-ave-living-room-after.webp" width="1152" height="1536" loading="lazy" alt="Same Alexandria living room after household debris was removed"></figure>
      <figure><span class="photo-label">Kitchen &bull; Before</span><img src="/assets/images/cook-ave/cook-ave-kitchen-entry-before.webp" width="1152" height="1536" loading="lazy" alt="Kitchen before an Alexandria property cleanout with loose household debris"></figure>
      <figure><span class="photo-label after">Kitchen &bull; After</span><img src="/assets/images/cook-ave/cook-ave-kitchen-entry-after.webp" width="1152" height="1536" loading="lazy" alt="Same Alexandria kitchen after household debris was removed"></figure>
    </div>
    <p class="center-link"><a class="btn btn-secondary" href="/projects/alexandria-duplex-cleanout/">See Full Cleanout <span aria-hidden="true">&rarr;</span></a></p>
  </div>
</section>

<section class="section compact-pricing" id="pricing">
  <div class="container pricing-panel">
    <div><p class="eyebrow">Straightforward Pricing</p><h2>Clear starting points.</h2></div>
    <div><p class="pricing-summary">Single-item pickups from <strong>$75</strong>. Small jobs from <strong>$150</strong>. Larger property cleanouts are quoted from photos.</p><p class="pricing-detail">Final pricing depends on volume, weight, access, labor, and disposal requirements.</p><a class="learn-more" href="${sms}">Get a Photo Estimate</a></div>
  </div>
</section>

<section class="section contact compact-contact" id="contact">
  <div class="container contact-grid">
    <aside class="contact-card">
      <p class="eyebrow">Free photo estimate</p><h2>Ready to clear it out?</h2>
      <p>Send a few photos and your location for a fast estimate.</p>
      <div class="button-stack"><a class="btn btn-primary" href="${sms}">&#128247; Text Photos for Quote</a><a class="btn btn-secondary" href="tel:${tel}">Call ${phone}</a></div>
      <button class="tertiary-action" type="button" data-open-estimate aria-controls="estimate-options">Request Estimate Online</button>
      <p class="contact-email"><a href="mailto:${email}">${email}</a></p>
    </aside>
    <details class="estimate-details" id="estimate-options">
      <summary>Request Estimate Online <span aria-hidden="true">+</span></summary>
      <form class="estimate-form" id="estimateForm" action="https://formspree.io/f/xgojwqao" method="post">
      <input type="hidden" name="_subject" value="New Clear Path estimate request">
      <div class="form-intro full"><p class="eyebrow">Prefer a form?</p><h3>Request Estimate Online</h3></div>
      <div class="form-row"><label for="name">Name</label><input id="name" name="name" autocomplete="name" required></div>
      <div class="form-row"><label for="phone">Phone</label><input id="phone" name="phone" type="tel" autocomplete="tel" required></div>
      <div class="form-row full"><label for="email">Email <span class="optional-label">(optional)</span></label><input id="email" name="email" type="email" autocomplete="email"></div>
      <div class="form-row full"><label for="description">What needs to go?</label><textarea id="description" name="description" required></textarea></div>
      <button class="btn btn-outline full form-submit" type="submit">Request Estimate Online</button>
      <p class="form-success" id="formSuccess" role="status" aria-live="polite">Thanks! Your request was received. For the fastest quote, text photos to ${phone}.</p>
      <p class="form-error" id="formError" role="alert">We could not send your request. Please text photos to ${phone}.</p>
      </form>
    </details>
  </div>
</section>`;
}

module.exports = { homepage };
