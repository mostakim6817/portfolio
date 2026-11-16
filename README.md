# Md. Mostakim — Personal Developer Portfolio

A minimal, classic, responsive personal portfolio website built with semantic HTML, modular CSS, and lightweight vanilla JavaScript.

## Project Structure

```text
portfolio/
├── index.html                        # Semantic HTML5 document
├── css/
│   └── styles.css                    # Design tokens, responsive layout, animations
├── js/
│   └── main.js                       # Navigation, scroll spy, reveal animations, certificate viewer
├── assets/
│   ├── favicon.svg                   # Custom SVG favicon
│   └── images/
│       ├── profile.jpg               # Optimized profile portrait
│       ├── cert-bytetocode.jpg       # ByteToCode certificate
│       ├── cert-aiub-cnr.jpg         # AIUB Center for Nanotechnology Research certificate
│       ├── cert-prime-bank.jpg       # Prime Bank PLC certificate
│       └── cert-bkash.jpg            # bKash certificate
└── README.md
```

## Design Highlights

- **Palette:** Deep navy (`#14243A`), off-white canvas (`#F5F7FA`), white surface (`#FFFFFF`), muted teal accent (`#16877E`), slate secondary text (`#526174`), and subtle hairline borders (`#D9E1E9`).
- **Typography:** Inter (loaded via Google Fonts with system sans-serif fallbacks).
- **Accessibility:** Skip-to-content link, semantic landmarks, keyboard-accessible mobile drawer and certificate lightbox modal, WCAG AA text contrast, and `prefers-reduced-motion` support.
- **Performance:** Zero framework or animation library dependencies, Intersection Observer scroll reveals, explicit image dimensions to avoid layout shifts, and progressive JPEG assets.

## Running Locally

No build step or package installation is required. You can open `index.html` directly in a browser or serve the folder with any static server:

### Using Python

```bash
cd portfolio
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

### Using Node.js

```bash
cd portfolio
npx serve .
```

## Updating Content

- **Profile & Bio:** Edit the Hero (`#home`) and About (`#about`) sections in `index.html`.
- **Skills, Projects, Education, & Certificates:** Each section in `index.html` is clearly commented and uses consistent semantic markup.
- **Images:** Replace files in `assets/images/` keeping the same filenames, or update the corresponding `src`, `width`, and `height` attributes in `index.html`.
- **Theme Colors & Spacing:** Adjust CSS custom properties at the top of `css/styles.css` under `:root`.

## Deployment

### GitHub Pages

1. Push the contents of the `portfolio/` directory to a GitHub repository (for example, `mostakim6817.github.io` or a project repository).
2. Open the repository **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select the `main` branch and `/ (root)` folder, then save.
4. Your site will be live shortly at `https://<username>.github.io/` (or `https://<username>.github.io/<repo-name>/`).

### Netlify

1. Drag and drop the `portfolio/` folder into [Netlify Drop](https://app.netlify.com/drop), or connect your GitHub repository.
2. Leave the build command empty and set the publish directory to `.` (or `portfolio` if pushing the parent folder).

### Vercel

1. Import your GitHub repository in [Vercel](https://vercel.com/).
2. Select **Other** as the framework preset, leave the build command empty, and set the root/output directory to `portfolio` (or `.` if the files are at the repository root).
