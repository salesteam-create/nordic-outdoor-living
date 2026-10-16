# Nordic Outdoor Living: homepage prototype

Static homepage prototype for the NOL modular outdoor kitchen, built for client review and hosted on GitHub Pages.

## Structure

```
index.html            The page (HTML, CSS and JS in one file)
assets/frames/        30-frame render sequence (closed to open), used by the hero and "What's inside"
assets/finish/        Open renders per finish (Spruce, Graphite, Birch)
assets/photos/        Lifestyle photo slots (see assets/photos/README.md)
assets/vendor/        GSAP 3.12.5 + ScrollTrigger, bundled locally
```

## Updating content

- **Unconfirmed details** are wrapped in `<span class="tbc">[...]</span>`. The "Highlight unconfirmed" button in the top bar highlights all of them.
- **Price, monthly payment, deposit and footprint** live in the `PRODUCT` object near the top of the main script. Set a number and every price on the page updates.
- **Finishes and add-ons** are the `FINISHES` and `ADDONS` arrays in the same script.
- **Lifestyle photos**: add `life-1.jpg`, `life-2.jpg` and `life-3.jpg` to `assets/photos/`. They replace the placeholder frames automatically.
- **Renders**: replace files in `assets/frames/` or `assets/finish/` with the same names and sizes (1120 x 644, transparent background).

## Hosting on GitHub Pages

Settings > Pages > Build and deployment > Source: "Deploy from a branch", then pick the branch and the `/ (root)` folder. The site publishes at `https://salesteam-create.github.io/nordic-outdoor-living/`.

The page has `noindex` set so search engines skip the prototype. Remove that meta tag on the live store.
