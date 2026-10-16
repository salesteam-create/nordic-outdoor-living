# Nordic Outdoor Living: homepage prototype

Static homepage prototype for the NOL modular outdoor kitchen, built for client review and hosted on GitHub Pages.

## Structure

```
index.html            The page (HTML, CSS and JS in one file)
assets/frames/        30-frame render sequence (closed to open), used by the hero and "What's inside"
assets/finish/        Open renders per finish (Spruce, Graphite, Birch)
assets/photos/        Lifestyle photo slots (see assets/photos/README.md)
assets/video/         Hero background video (muted, no audio track) and its poster frame
assets/vendor/        GSAP 3.12.5 + ScrollTrigger, bundled locally
```

## Updating content

- **Unconfirmed details** are wrapped in `<span class="tbc">[...]</span>`. The "Highlight unconfirmed" button in the top bar highlights all of them.
- **Price, monthly payment, deposit and footprint** live in the `PRODUCT` object near the top of the main script. Set a number and every price on the page updates.
- **Finishes and add-ons** are the `FINISHES` and `ADDONS` arrays in the same script.
- **Lifestyle photos**: add `build.jpg`, `life-1.jpg`, `life-2.jpg` and `life-3.jpg` to `assets/photos/`. They replace the placeholders automatically.
- **Hero video**: replace `assets/video/hero.mp4`, `hero.webm` and `hero-poster.jpg`. Strip the audio track when exporting.
- **Renders**: replace files in `assets/frames/` or `assets/finish/` with the same names and sizes (1120 x 644, transparent background).

## Hosting on GitHub Pages

Settings > Pages > Build and deployment > Source: "Deploy from a branch", then pick the branch and the `/ (root)` folder. The site publishes at `https://salesteam-create.github.io/nordic-outdoor-living/`.

The page has `noindex` set so search engines skip the prototype. Remove that meta tag on the live store.

## Versions

- **v1** (commit `bb3243c`): warm cream and spruce look with serif headlines.
- **v2** (commit `c16fb8d`): white, photo-led look with a muted hero video, modeled on a premium Shopify theme.

To go back to v1: `git checkout bb3243c -- index.html` (assets are shared), then commit and push. Both commits stay in the branch history.
