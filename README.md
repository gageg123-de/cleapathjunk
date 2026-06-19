# Clear Path Junk Removal Website

Static GitHub Pages-ready website for Clear Path Junk Removal.

## Project Structure

- `index.html` - page content and SEO metadata
- `style.css` - visual design, responsive layout, and animations
- `script.js` - navbar behavior, before/after slider, reveal animations, and form success state
- `assets/images/` - website images

## Image Assets

Current assets:

- `assets/images/hero-truck.png` - hero background image
- `assets/images/before-after.png` - before/after comparison image
- `assets/images/logo.png` - Clear Path logo
- `assets/images/service-furniture.jpg` - supporting service photo
- `assets/images/service-garage.jpg` - supporting service photo
- `assets/images/service-yard.jpg` - supporting service photo

WebP conversion tools were not available in this local environment, so the images are stored with correct PNG/JPG extensions instead of fake `.webp` files. If you later convert them to WebP, update the corresponding paths in `style.css` and `index.html`.

## Run Locally

Open `index.html` directly in a browser, or serve the folder with any simple static server.

## Edit Contact Info

Search in `index.html` for:

- `318-290-8863`
- `clearpathjunkremoval@gmail.com`

Replace those values wherever needed.

## Deploy To GitHub Pages

1. Upload all files and folders to a GitHub repository.
2. Go to repository Settings > Pages.
3. Choose Deploy from a branch.
4. Select the `main` branch and root folder.
5. Save and wait for GitHub Pages to publish.

No build step, dependencies, framework, or package manager is required.