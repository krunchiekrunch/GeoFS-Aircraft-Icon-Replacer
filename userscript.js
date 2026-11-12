// ==UserScript==
// @name         GeoFS NAV Aircraft Icon Replacer
// @version      1.0
// @description  Replace aircaft icons in the NAV map for better visiblity
// @author       krunchiekrunch
// @match        https://*.geo-fs.com/geofs.php*
// @icon         https://www.geo-fs.com/images/icons/favicon.ico
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/krunchiekrunch/GeoFS-Aircraft-Icon-Replacer/refs/heads/main/userscript.js
// @updateURL    https://raw.githubusercontent.com/krunchiekrunch/GeoFS-Aircraft-Icon-Replacer/refs/heads/main/userscript.js
// @run-at       document-start
// @license      CC BY-NC-SA 4.0
// ==/UserScript==

(function () {
    'use strict';

    const replacements = {
        'https://www.geo-fs.com/images/map/icons/yellow.png':
            'https://raw.githubusercontent.com/krunchiekrunch/GeoFS-Better-NAV-Map/refs/heads/main/assets/self.png',

        'https://www.geo-fs.com/images/map/icons/blue.png':
            'https://raw.githubusercontent.com/krunchiekrunch/GeoFS-Better-NAV-Map/refs/heads/main/assets/others.png',

        'https://beta.geo-fs.com/images/map/icons/yellow.png':
            'https://raw.githubusercontent.com/krunchiekrunch/GeoFS-Better-NAV-Map/refs/heads/main/assets/self.png',

        'https://beta.geo-fs.com/images/map/icons/blue.png':
            'https://raw.githubusercontent.com/krunchiekrunch/GeoFS-Better-NAV-Map/refs/heads/main/assets/others.png'
    };

    function replaceUrl(url) {
        if (typeof url !== 'string') return url;

        return replacements[url] || url;
    }

    // Intercept fetch requests
    const originalFetch = window.fetch;

    window.fetch = function (input, init) {
        if (typeof input === 'string') {
            input = replaceUrl(input);
        } else if (input instanceof Request) {
            const newUrl = replaceUrl(input.url);

            if (newUrl !== input.url) {
                input = new Request(newUrl, input);
            }
        }

        return originalFetch.call(this, input, init);
    };

    // Intercept XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function (method, url, ...args) {
        url = replaceUrl(url);

        return originalOpen.call(this, method, url, ...args);
    };

    // Replace existing and dynamically added images
    function replaceImages() {
        document.querySelectorAll('img').forEach(function (img) {
            const newUrl = replaceUrl(img.src);

            if (newUrl !== img.src) {
                img.src = newUrl;
            }
        });
    }

    // Run immediately
    replaceImages();

    // Observe dynamically added images
    const observer = new MutationObserver(replaceImages);

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();