# Nordic Outdoor Living: website prototype

Static prototype of the NOL store, built for client review and hosted on GitHub Pages. Product structure follows Tim's *NOL Outdoor Kitchen PODs: Modular System Guide* (Oct 27, 2026).

## Pages

```
index.html            Homepage: hero video, POD cards, configurator with POD picker, fit check, FAQ
pod-premium.html      POD 1 Premium product page   (generated, see below)
pod-signature.html    POD 2 Signature product page (generated)
pod-exclusive.html    POD 3 Exclusive product page (generated)
product.html          Redirect for old links (product.html?tier=best -> pod-exclusive.html)
```

## Where things live

```
assets/js/catalog.js        PODs, prices, sizes, parts, colors, cooking appliances, add-ons and rules
assets/js/configurator.js   Buy box shared by every page (POD, colors, cooking, fuel, LED color, add-ons, total)
assets/js/site.js           Shared header, menu, review mode, image codes, reveal
assets/js/pod-page.js       Product page: gallery, kit, comparison, specs, add-on grid
assets/css/site.css         All styles
templates/pod-main.html     Body of the product pages
tools/build_pod_pages.py    Builds the three pod-*.html files
assets/pods/  assets/parts/ Product and part images (concept renders)
```

## Common changes

- **Prices, sizes, what's included:** edit `assets/js/catalog.js`. Every page follows.
- **Launch only some PODs:** set `launched:false` on a POD in `catalog.js`. It disappears from cards, menus, comparisons and upgrade nudges, and its page redirects home. With one POD launched, the homepage drops the POD picker and comparison.
- **Header, footer or product page layout:** edit `index.html` or `templates/pod-main.html`, then run `python3 tools/build_pod_pages.py`.
- **Images:** every image has a code (e.g. `POD-S-01`). Click "Highlight unconfirmed" in the top bar to see the codes on the page. The shot list maps each code to what to shoot. Replace a file with the same name and size to swap it.

## Versions

- **v1** (commit `bb3243c`): warm cream and spruce look with serif headlines.
- **v2** (commit `c16fb8d`): white, photo-led look with a muted hero video.
- **v3**: POD 1 / 2 / 3 per the Modular System Guide, separate product pages, upgrade nudges, launch switch.

## Hosting on GitHub Pages

Settings > Pages > Deploy from a branch, pick the branch and `/ (root)`. The pages have `noindex` set so search engines skip the prototype.
