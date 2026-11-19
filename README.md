# Nordic Outdoor Living: website prototype

Static prototype of the NOL store, built for client review and hosted on GitHub Pages. Following Tim's latest feedback, the store sells one product, the NOL Outdoor Kitchen POD (the former "Good" kit). There are no tier names. The page layout follows a single-product Shopify page: image hero, feature cards that scroll sideways as you scroll down, product with callouts, buy box, one scroll-driven section, detail and delivery carousels, specs, comparison, FAQ.

## Pages

```
index.html        The product page (everything lives here)
pod-good.html     Redirect to index.html#buy (old links)
pod-better.html   Redirect to index.html#buy (old links)
pod-best.html     Redirect to index.html#buy (old links)
product.html      Redirect to index.html#buy (old links)
```

## Where things live

```
assets/css/store.css   All styles (light, Google Sans Flex)
assets/js/store.js     Product data at the top (price, options, add-ons, specs), then all page behaviour. No libraries.
assets/frames/         30 rendered frames, scrubbed by scroll in "How it opens". Loaded only when the section is near.
assets/photos/hero*    Hero image (2000 px WebP, 1200 px WebP for phones, JPG for link previews)
assets/video/          Garden video, used in the product gallery
assets/pods, parts, photos   Product, part and lifestyle images
```

## Weight

HTML, CSS and JS are about 20 KB gzipped in total. No WebGL, no animation library. The hero image is 140 KB on phones and 300 KB on desktop. The 30 frames (1.4 MB) load only when a visitor nears that section; the video loads only if opened in the gallery.

## Common changes

- **Price, deposit, monthly, options, add-ons, specs:** edit the `P` object at the top of `assets/js/store.js`.
- **Feature, detail and delivery cards:** edit `FEATURES`, `DETAILS` and `STEPS` in the same file.
- **Feature cards:** scrolling down moves them sideways while the section is pinned. With reduced motion turned on they become a normal swipeable row.
- **Swap the scroll animation:** replace `assets/frames/00.webp` to `29.webp` with a new rendered sequence (same names). More frames: change `N` in the sequence block.
- **Moving to Shopify:** each `<section>` maps to a theme section. The buy box options map to product variants and line-item properties, and "Reserve" becomes a deposit product added to the cart.

## Versions

Frozen copies that open on their own live in `versions/` (see `versions/README.md`). The main site keeps changing; the snapshots never do.

- **v1**: warm cream and spruce look with serif headlines.
- **v2**: white, photo-led look with a muted hero video.
- **v3**: Good / Better / Best per the Modular System Guide, product pages, upgrade nudges.
- **v4**: dark cinematic homepage with a coded 3D model.
- **v5**: light homepage with a coded 3D hero, Good / Better / Best product pages.
- **v6 (current)**: single product, light, conversion-focused product page with one rendered scroll sequence.

## Hosting on GitHub Pages

Settings > Pages > Deploy from a branch, pick the branch and `/ (root)`. The pages have `noindex` set so search engines skip the prototype.
