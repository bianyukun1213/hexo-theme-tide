'use strict';

const { isString, isArray } = require('./tide-utils.js');

const scriptName = 'tide-helper-json-ld';
hexo.extend.helper.register('json_ld', function (jsonldConfig, language, headline, description, author, datePublished, dateModified, mainEntityOfPage, image) {
    let jsonldTemplate = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@language": language,
        "headline": headline,
        "description": description,
        "datePublished": datePublished.format(),
        "dateModified": dateModified.format(),
        "mainEntityOfPage": mainEntityOfPage
    };
    let authors = [];
    if (isArray(author)) {
        authors = author.map(a => a);
    } else if (isString(author)) {
        authors.push(author);
    }
    if (authors.length > 0) {
        jsonldTemplate.author = [];
        for (const au of authors) {
            if (jsonldConfig.organization_authors.includes(au)) {
                jsonldTemplate.author.push({
                    "@type": "Organization",
                    "name": au
                });
            } else {
                jsonldTemplate.author.push({
                    "@type": "Person",
                    "name": au
                });
            }
        }
    }
    if (image) {
        jsonldTemplate.image = [image];
    }
    return `<script type="application/ld+json">${JSON.stringify(jsonldTemplate)}</script>`;
});
