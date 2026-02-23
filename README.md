# Adriana & Lorenzo — Wedding Website

A beautiful multi-page wedding website built from the wedding guide PDF.

## Pages

| Page | File | Color |
|------|------|-------|
| Home (Intro) | `index.html` | Light blue |
| Location | `location.html` | Light blue |
| The Day | `the-day.html` | Sage green |
| RSVP | `rsvp.html` | Deep red |
| Wedding List | `wedding-list.html` | Dark teal |

## Setup on GitHub

### 1. Create the repository
```bash
git init
git add .
git commit -m "Initial wedding website"
gh repo create adrianaandlorenzo --public
git remote add origin https://github.com/YOUR_USERNAME/adrianaandlorenzo.git
git push -u origin main
```

### 2. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. The site will be live at: `https://YOUR_USERNAME.github.io/adrianaandlorenzo/`

### 3. Add your RSVP link
In `rsvp.html`, replace the `href="#"` on the RSVP button with your actual form link (Google Forms, Typeform, etc.).

```html
<a class="rsvp-btn" href="YOUR_RSVP_LINK_HERE">
  Submit RSVP →
</a>
```

## Local preview
Just open `index.html` in your browser — no build step needed.
