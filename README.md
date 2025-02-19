# GovOS Document Downloader

GovOS Document Downloader is a userscript that modifies the document preview pages on GovOS public records access platforms (i.e., PublicSearch) to enable downloading of uncertified PDF documents. The script compiles individual document preview pages into a single PDF document and requires that a document preview be available.

## Installation and Usage Instructions
1. Install a userscript web browser extension like [Violentmonkey](https://violentmonkey.github.io/) (recommended) or [Tampermonkey](https://www.tampermonkey.net/).
2. Open the [latest version](https://raw.githubusercontent.com/rplanier/govos-document-downloader/master/govos-document-downloader.user.js) of this userscript in your web browser. Your userscript extension should prompt you to install the userscript.
3. Visit the document preview page of any document on a GovOS public record access platform. The document preview page typically provides a watermarked document preview and a summary of the document details.
4. A green 'Download' button will now appear at the top of the document preview window.  Click the button and wait for the document to compile and automatically download.
5. If the 'Download' button does not automatically appear, refresh the document preview page to force the userscript to reload.
