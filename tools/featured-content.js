function homepage({ sms, phone, tel, email }) {
  return `<section class="home-hero" id="home">
  <div class="container home-hero-grid">
    <div class="home-hero-copy reveal">
      <p class="eyebrow">Junk Removal • Alexandria, LA</p>
      <h1>Clear the clutter.<br>Reclaim your space.</h1>
      <p class="home-hero-lead">Furniture, junk, and full property cleanouts throughout Alexandria and Central Louisiana.</p>
      <div class="button-row home-hero-actions">
        <a class="btn btn-primary" href="${sms}">📷 Text Photos for Quote</a>
        <a class="btn btn-outline" href="tel:${tel}">Call ${phone}</a>
      </div>
      <ul class="trust-row" aria-label="Service highlights"><li>Owner operated</li><li>Local</li><li>Fast estimates</li></ul>
    </div>
    <figure class="hero-job-photo reveal">
      <img src="/assets/images/cook-ave/cook-ave-living-room-before.webp" width="1152" height="1536" fetchpriority="high" alt="Alexandria property before a full household debris cleanout">
      <figcaption><span>Real local work</span> Alexandria property cleanout</figcaption>
    </figure>
  </div>
</section>

<section class="section results-section" id="results">
  <div class="container">
    <div class="section-head compact-head">
      <p class="eyebrow">Real results</p>
      <h2>See the difference.</h2>
      <p>Recent property cleanout in Alexandria, Louisiana.</p>
    </div>
    <div class="result-pair reveal">
      <figure><span class="photo-label">Before</span><img src="/assets/images/cook-ave/cook-ave-kitchen-wide-before.webp" width="1152" height="1536" loading="lazy" alt="Kitchen before an Alexandria property cleanout with household debris covering the floor"></figure>
      <figure><span class="photo-label after">After</span><img src="/assets/images/cook-ave/cook-ave-kitchen-wide-after.webp" width="1152" height="1536" loading="lazy" alt="Same Alexandria kitchen after Clear Path removed the household debris"></figure>
    </div>
    <p class="center-link"><a class="learn-more" href="/projects/alexandria-duplex-cleanout/">View Full Cleanout</a></p>
  </div>
</section>

<section class="section gray" id="services">
  <div class="container">
    <div class="section-head compact-head"><p class="eyebrow">Services</p><h2>What we haul</h2></div>
    <div class="haul-grid">
      <a class="haul-card" href="/services/property-cleanouts/"><span class="haul-icon">01</span><h3>Property Cleanouts</h3><p>Rentals, estates, move-outs, and full-home cleanouts.</p><span class="card-arrow">→</span></a>
      <a class="haul-card" href="/services/furniture-removal/"><span class="haul-icon">02</span><h3>Furniture &amp; Appliances</h3><p>Couches, mattresses, tables, washers, dryers, and more.</p><span class="card-arrow">→</span></a>
      <a class="haul-card" href="/services/"><span class="haul-icon">03</span><h3>Household Junk</h3><p>Boxes, clutter, broken items, and unwanted belongings.</p><span class="card-arrow">→</span></a>
      <a class="haul-card" href="/services/yard-debris-removal/"><span class="haul-icon">04</span><h3>Yard &amp; Outdoor Debris</h3><p>Brush, bagged debris, and non-hazardous outdoor cleanup.</p><span class="card-arrow">→</span></a>
    </div>
  </div>
</section>

<section class="section process-section">
  <div class="container">
    <div class="section-head compact-head"><p class="eyebrow">Simple process</p><h2>Photos to cleared space.</h2></div>
    <div class="compact-steps">
      <article><span>1</span><div><h3>Send Photos</h3><p>Text what needs to go.</p></div></article>
      <article><span>2</span><div><h3>Get Your Quote</h3><p>Receive a straightforward estimate.</p></div></article>
      <article><span>3</span><div><h3>We Haul It Away</h3><p>We load it and clear the space.</p></div></article>
    </div>
  </div>
</section>

<section class="section dark proof-section">
  <div class="container recent-work-grid">
    <img src="/assets/images/cook-ave/cook-ave-kitchen-wide-after.webp" width="1152" height="1536" loading="lazy" alt="Cleared kitchen after an Alexandria property cleanout">
    <div>
      <p class="eyebrow">Property Cleanout • Alexandria, LA</p>
      <h2>One property. A complete reset.</h2>
      <p>A full cleanout from heavy household debris to cleared rooms ready for the next stage.</p>
      <a class="btn btn-secondary" href="/projects/alexandria-duplex-cleanout/">See the Project →</a>
    </div>
  </div>
</section>

<section class="section trust-pricing" id="about">
  <div class="container trust-pricing-grid">
    <div><p class="eyebrow">Clear Path</p><h2>Local. Owner-operated. Straightforward.</h2><p>You send photos. We provide an estimate. We show up, load it, and haul it away.</p><ul class="trust-checks"><li>Direct communication</li><li>Real project results</li><li>Alexandria-area service</li></ul></div>
    <aside class="price-teaser"><p class="eyebrow">Straightforward pricing</p><p><strong>Single-item pickups from $75.</strong> Larger jobs and property cleanouts are quoted by volume, weight, access, labor, and disposal needs.</p><a class="learn-more" href="/blog/junk-removal-cost-alexandria-la/">How pricing works</a></aside>
  </div>
</section>

<section class="section contact compact-contact" id="contact">
  <div class="container contact-grid">
    <aside class="contact-card">
      <p class="eyebrow">Free photo estimate</p><h2>Ready to clear it out?</h2>
      <p>Send a few photos and your location for a fast estimate.</p>
      <div class="button-stack"><a class="btn btn-primary" href="${sms}">📷 Text Photos</a><a class="btn btn-secondary" href="tel:${tel}">Call ${phone}</a></div>
      <p class="contact-email"><a href="mailto:${email}">${email}</a></p>
    </aside>
    <form class="estimate-form" id="estimateForm" action="https://formspree.io/f/xgojwqao" method="post">
      <input type="hidden" name="_subject" value="New Clear Path estimate request">
      <div class="form-row"><label for="name">Name</label><input id="name" name="name" autocomplete="name" required></div>
      <div class="form-row"><label for="phone">Phone</label><input id="phone" name="phone" type="tel" autocomplete="tel" required></div>
      <div class="form-row full"><label for="email">Email <span class="optional-label">(optional)</span></label><input id="email" name="email" type="email" autocomplete="email"></div>
      <div class="form-row full"><label for="description">What needs to go?</label><textarea id="description" name="description" required></textarea></div>
      <button class="btn btn-primary full form-submit" type="submit">Request Free Estimate</button>
      <p class="form-success" id="formSuccess" role="status" aria-live="polite">Thanks! Your request was received. For the fastest quote, text photos to ${phone}.</p>
      <p class="form-error" id="formError" role="alert">We could not send your request. Please text photos to ${phone}.</p>
    </form>
  </div>
</section>`;
}

const pair = ({ title, before, after, beforeAlt, afterAlt }) => `<article class="comparison-block">
  <h3>${title}</h3>
  <div class="comparison-grid">
    <figure><span class="photo-label">Before</span><img src="/assets/images/cook-ave/${before}" width="1152" height="1536" loading="lazy" alt="${beforeAlt}"></figure>
    <figure><span class="photo-label after">After</span><img src="/assets/images/cook-ave/${after}" width="1152" height="1536" loading="lazy" alt="${afterAlt}"></figure>
  </div>
</article>`;

function alexandriaProject({ pageHero, projectCrumbs, cta }) {
  const pairs = [
    { title: "Living Room", before: "cook-ave-living-room-before.webp", after: "cook-ave-living-room-after.webp", beforeAlt: "Living room before an Alexandria property cleanout with loose household debris across the floor", afterAlt: "Same Alexandria living room cleared after household debris removal" },
    { title: "Kitchen — Wide View", before: "cook-ave-kitchen-wide-before.webp", after: "cook-ave-kitchen-wide-after.webp", beforeAlt: "Kitchen before the Alexandria cleanout with household debris covering the floor", afterAlt: "Same kitchen cleared after the Alexandria property cleanout" },
    { title: "Kitchen — Entry View", before: "cook-ave-kitchen-entry-before.webp", after: "cook-ave-kitchen-entry-after.webp", beforeAlt: "Kitchen entry before removal with loose trash and household debris", afterAlt: "Kitchen entry after Clear Path removed the debris" },
    { title: "Additional Room", before: "cook-ave-second-room-before.webp", after: "cook-ave-second-room-after.webp", beforeAlt: "Additional room before the property cleanout with household debris across the floor", afterAlt: "Additional room after the household debris was removed" },
    { title: "Covered Porch", before: "cook-ave-porch-before.webp", after: "cook-ave-porch-after.webp", beforeAlt: "Covered porch before cleanup with a pile of household debris", afterAlt: "Covered porch after Clear Path removed the debris pile" },
  ];

  return pageHero(projectCrumbs, "Alexandria Property Cleanout", "A full property cleanout with household debris removed from multiple rooms and the covered porch.", true) + `
  <section class="section project-intro"><div class="container project-intro-grid">
    <div><p class="eyebrow">The job</p><h2>Room by room, cleared.</h2><p>Clear Path removed household junk and loose debris throughout the property, including interior rooms and the covered porch. The primary cleanout work was completed in one working day.</p></div>
    <aside class="project-facts"><span>Full property cleanout</span><span>Alexandria, Louisiana</span><span>Completed in one primary working day</span></aside>
  </div></section>
  <section class="section gray project-gallery"><div class="container">
    <div class="section-head compact-head"><p class="eyebrow">Before &amp; after</p><h2>Real project results.</h2></div>
    ${pairs.map(pair).join("")}
  </div></section>
  <section class="section"><div class="container removal-summary">
    <div><p class="eyebrow">What we removed</p><h2>Household debris across the property.</h2></div>
    <ul class="check-list"><li>Loose household junk and bagged debris</li><li>Boxes, packaging, and unwanted belongings</li><li>Bulky household materials</li><li>Appropriate exterior and porch debris</li></ul>
  </div></section>${cta("Need a property cleared?")}`;
}

function projectsIndex({ pageHero, cta }) {
  return pageHero([["Home", "/"], ["Recent Work", "/projects/"]], "Recent Clear Path Cleanouts", "Genuine project photos show the work without exposing customer or address details.") + `
  <section class="section"><div class="container"><article class="project-card project-card-horizontal">
    <img src="/assets/images/cook-ave/cook-ave-living-room-after.webp" width="1152" height="1536" loading="lazy" alt="Cleared living room after an Alexandria property cleanout">
    <div class="project-body"><p class="eyebrow">Property Cleanout • Alexandria, LA</p><h2>Alexandria Property Cleanout</h2><p>Multiple rooms and a covered porch cleared of heavy household debris.</p><a class="learn-more" href="/projects/alexandria-duplex-cleanout/">See the Project</a></div>
  </article></div></section>${cta("Have a similar cleanout?")}`;
}

module.exports = { alexandriaProject, homepage, projectsIndex };
