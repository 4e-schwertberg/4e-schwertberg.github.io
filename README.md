# 4E Schwertberg – Website

Website of the renewable energy community 4E Schwertberg: https://www.4e-schwertberg.at

Static site built with [Jekyll](https://jekyllrb.com) and deployed to GitHub Pages by
`.github/workflows/pages-deploy.yml` on every push to `main`.

## Local development

With the devcontainer (VS Code “Reopen in Container”):

    bundle install
    bundle exec jekyll serve          # http://127.0.0.1:4000

Without it (Docker):

    docker run --rm -it -p 4000:4000 -v "$PWD":/srv -w /srv ruby:3.3 \
      bash -c 'bundle install && bundle exec jekyll serve -H 0.0.0.0'

Check links like CI does:

    JEKYLL_ENV=production bundle exec jekyll build
    bundle exec htmlproofer _site --disable-external

## Where things are

- `index.html` – homepage; news go under "Aktuelles".
- `_tabs/` – pages in the sidebar. Front matter: `title`, `icon` (Font Awesome class), `order`, `permalink`.
- `_pages/` – other pages (Datenschutz, Impressum, Aufnahmeantrag …).
- `_data/config4e.yml` – contact data, prices, fees, chart values; `_data/faq.yml` – FAQ.
- `_layouts/`, `_includes/`, `assets/js/site.js` – page frame (sidebar, topbar, footer, colour mode).
- `_sass/chirpy/` – layout styles (trimmed Chirpy); `assets/css/4e.css` – our own styles.
- Boxes in Markdown: add `{: .prompt-tip }` (or `-info`, `-warning`, `-danger`) on the line after a `>` quote.
- `_pages/aufnahmeantrag.html` + `assets/js/myform.js` – online membership form; creates the PDFs in the
  browser with pdf-lib (`assets/vendor/pdf-lib-1.17.1`) from `assets/docs/*-template.pdf`.
  `myform.js` is the readable source; the deploy workflow minifies it.
- `sw.min.js` – removes the service worker of the former site from visitors' browsers; keep until end of 2027.

## Credits

The layout and styles are based on the Jekyll theme [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy)
by Cotes Chung (MIT License, see `LICENSES/jekyll-theme-chirpy.txt`). Fonts: Lato (SIL OFL),
icons: Font Awesome Free 6.7.1 (CC BY 4.0 / OFL / MIT), CSS framework: Bootstrap 5.3.6 (MIT),
PDF generation: pdf-lib 1.17.1 (MIT).

## License

The texts, images and other content of this website are © 4E Schwertberg, all rights reserved. There is no
open-source licence for the association's own content. Third-party parts keep their own licences: the Chirpy
licences are in `LICENSES/`.
