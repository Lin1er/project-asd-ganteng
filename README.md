# Lab Material Queue Project

## GitHub Pages Deployment Guide

### Structure
- All static web files for GitHub Pages deployment are in the `web/` folder:
  - `web/index.html`
  - `web/app.js`
  - `web/app.wasm`
  - `web/style.css`
  - `web/lab.js` (if used)

### To deploy this site via GitHub Pages:

1. **Copy all content of `web/` folder to a new folder named `docs/` at the root of this repo.**

    ```sh
    cp -r web docs
    ```
    *(Or you can move, as long as all is duplicated there)*

2. **Push your changes.**

3. **In GitHub** (repo Settings > Pages):
    - Set Pages source to `main` (branch), `/docs` folder
    - Save. Wait for the deployment (about 1 min)
    - Your app will be live at: `https://<username>.github.io/<repo-name>/`

4. **Edit resource links in `index.html` if needed:**
    - If you use folders/subfolder, make sure all `src`, `href` are relative (e.g. `app.js`, **not** `/app.js`)
    - Typical config is already using relative path — see source

---
### Automation (optional)
- You can add a GitHub Actions workflow to auto-build and copy `web/*` to `docs/` if you want continuous deploy.
- Or just manually copy and commit once after updating web.

---
### Notes
- GitHub Pages can serve only static files. WASM/JS apps are fully supported.
- If you use any fetch() or AJAX, the path must be relative (`./app.wasm`), no CORS error, not refer backend API unless public.
- Do NOT put C++/main.cpp/backend/server here — just web build results.
- If you want the root path (not /docs/) as the homepage, you can move web content to root and set source as `/ (root)`.

---

## Quick one-liner:
```sh
rm -rf docs && cp -r web docs && git add docs && git commit -m "docs: deploy to github pages" && git push
```
