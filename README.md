# Nordic Outdoor Living: website prototype

Static prototype of the NOL store, built for client review and hosted on GitHub Pages. Product structure follows Tim's *NOL Outdoor Kitchen PODs: Modular System Guide* (Oct 27, 2026), with the POD names kept as Good, Better and Best.

## Pages

```
index.html            Homepage: hero video, POD cards, configurator with POD picker, fit check, FAQ
pod-good.html      POD 1 Good product page   (generated, see below)
pod-better.html    POD 2 Better product page (generated)
pod-best.html    POD 3 Best product page (generated)
product.html          Redirect for old links (product.html?tier=best -> pod-best.html)
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
- **Upgrade nudge:** the gap to a bigger POD counts add-ons it already includes. It is highlighted once the setup has closed 30% of the price gap (`upsellHotShare` in `catalog.js`). At that moment a pop-up suggests the upgrade, once per POD per visit, closing itself after 12 seconds.
- **Launch only some PODs:** set `launched:false` on a POD in `catalog.js`. It disappears from cards, menus, comparisons and upgrade nudges, and its page redirects home. With one POD launched, the homepage drops the POD picker and comparison.
- **Header, footer or product page layout:** edit `index.html` or `templates/pod-main.html`, then run `python3 tools/build_pod_pages.py`.
- **Images:** every image has a code (e.g. `POD2-01`). Click "Highlight unconfirmed" in the top bar to see the codes on the page. The shot list maps each code to what to shoot. Replace a file with the same name and size to swap it.

## Versions

Frozen copies that open on their own live in `versions/` (see `versions/README.md`). The main site keeps changing; the snapshots never do.


- **v1** (commit `bb3243c`): warm cream and spruce look with serif headlines.
- **v2** (commit `c16fb8d`): white, photo-led look with a muted hero video.
- **v3**: POD 1 / 2 / 3 per the Modular System Guide, separate product pages, upgrade nudges, launch switch.
- **v3.1**: names back to Good / Better / Best, upgrade prices based on the customer's setup, scroll-animation fixes.
- **Saved snapshots:** `versions/v1/`, `versions/v2/` and `versions/v3/` open on their own. See `versions/README.md`.

## Hosting on GitHub Pages

Settings > Pages > Deploy from a branch, pick the branch and `/ (root)`. The pages have `noindex` set so search engines skip the prototype.
