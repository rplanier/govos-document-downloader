# GovOS Document Downloader

GovOS Document Downloader is a userscript that modifies the document preview pages on GovOS public records access platforms (e.g., PublicSearch.us) to enable downloading of uncertified PDF documents and quick instrument searching. The script compiles individual document preview pages into a single PDF document and requires that a document preview be available.

## Installation Instructions

1. Install a userscript web browser extension like [Violentmonkey](https://violentmonkey.github.io/) (recommended) or [Tampermonkey](https://www.tampermonkey.net/).
2. Open the [latest version](https://raw.githubusercontent.com/rplanier/govos-document-downloader/master/govos-document-downloader.user.js) of this userscript in your web browser. Your userscript extension should prompt you to install the userscript.

## Usage Instructions

1. Visit the document preview page of any document on a GovOS public record access platform (e.g., `https://[county][state].publicsearch.us/doc/[document-number]`). The document preview page typically provides a watermarked document preview and a summary of the document details.
2. A green 'Download' button will now appear at the top of the document preview window.  Click the button and **wait for the document to compile and automatically download**.
3. A small form next to the 'Download' button allows for quick searching of instruments by volume and page number.
4. If the 'Download' button or the search for do not automatically appear, refresh the document preview page to force the userscript to reload.

## Screenshots

![screenshot](assets/img/screenshot-1.png)
