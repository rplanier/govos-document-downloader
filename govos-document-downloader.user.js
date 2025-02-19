// ==UserScript==
// @name          GovOS Document Downloader
// @author        rplanier
// @namespace     https://www.github.com/rplanier
// @source        https://www.github.com/rplanier/govos-document-downloader
// @description   Adds a download button to the GovOS document summary page and compiles all watermarked pages into a single PDF for download.
// @version       0.1.1
// @match         *://*.publicsearch.us/*
// @run-at        document-end
// @require       https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js
// @icon          https://eddy.nm.publicsearch.us/img/favicon-32x32.png
// @updateURL     https://raw.githubusercontent.com/rplanier/govos-document-downloader/master/govos-document-downloader.user.js
// @downloadURL   https://raw.githubusercontent.com/rplanier/govos-document-downloader/master/govos-document-downloader.user.js
// @supportURL    https://github.com/rplanier/govos-document-downloader/issues
// ==/UserScript==

// Create a mutation observer to detect page changes
new MutationObserver(items => {
    evaluate();
  }).observe(
    document.querySelector("title"), {
      subtree: true,
      childList: true
    }
  );

let downloadButton, searchButton;

// Evaluate the current page
evaluate();

/**
 * Add a download button
 **/
async function addDownloadButton(parent) {
  // Determine the existing button classes
    const buttonClass = parent.lastChild.className;

    // Create a download button
    downloadButton = document.createElement("button");
    let svg =`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" style="margin-right: 6px;"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z" fill="#FFFFFF"></path> </g></svg>`;
    downloadButton.innerHTML = svg + " Download";
    downloadButton.title = "Download a compiled PDF";
    downloadButton.setAttribute("class", buttonClass);
    downloadButton.style.background = "#43966a";
    downloadButton.style.opacity = 1;
    downloadButton.onclick = function() {
      downloadButton.innerHTML = svg + " Downloading...";
      downloadButton.disabled = true;
      downloadButton.style.opacity = 0.5;
      downloadButton.style.cursor = "not-allowed";
      download().then(() => {
        downloadButton.innerHTML = svg + " Download";
        downloadButton.disabled = false;
        downloadButton.style.opacity = 1;
        downloadButton.style.cursor = "pointer";
      });
    };

    // Append the button to the parent
    parent.appendChild(downloadButton);
}

/**
 * Add an instrument search form
 **/
async function addSearchForm(parent) {
  // Determine the existing button classes
    const buttonClass = parent.lastChild.className;

  // Create a form
  let form = document.createElement("form");
  form.method = "GET";
  form.action = "https://eddy.nm.publicsearch.us/results?department=RP&page=138&recordedDateRange=16000101%2C20250219&searchType=advancedSearch&volume=1175";
  form.style.display = "flex";

  let inputDepartment = document.createElement("input");
  inputDepartment.type = "hidden";
  inputDepartment.name = "department";
  inputDepartment.value = "RP";

  let inputSearchType = document.createElement("input");
  inputSearchType.type = "hidden";
  inputSearchType.name = "searchType";
  inputSearchType.value = "advancedSearch";

  let inputVolume = document.createElement("input");
  inputVolume.type = "text";
  inputVolume.name = "volume";
  inputVolume.placeholder = "Volume";
  inputVolume.style.width = "50px";
  inputVolume.style.border = "thin solid #CCC";
  inputVolume.style.padding = "8px";
  inputVolume.style.marginRight = "8px";

  let inputPage = document.createElement("input");
  inputPage.type = "text";
  inputPage.name = "page";
  inputPage.placeholder = "Page";
  inputPage.style.width = "50px";
  inputPage.style.border = "thin solid #CCC";
  inputPage.style.padding = "8px";
  inputPage.style.marginRight = "8px";

  searchButton = document.createElement("button");
  svg = `<svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#FFFFFF" width="18" height="18" style="margin-right: 6px;" stroke="#FFFFFF"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>search</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"> <g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-256.000000, -1139.000000)" fill="#FFFFFF"> <path d="M269.46,1163.45 C263.17,1163.45 258.071,1158.44 258.071,1152.25 C258.071,1146.06 263.17,1141.04 269.46,1141.04 C275.75,1141.04 280.85,1146.06 280.85,1152.25 C280.85,1158.44 275.75,1163.45 269.46,1163.45 L269.46,1163.45 Z M287.688,1169.25 L279.429,1161.12 C281.591,1158.77 282.92,1155.67 282.92,1152.25 C282.92,1144.93 276.894,1139 269.46,1139 C262.026,1139 256,1144.93 256,1152.25 C256,1159.56 262.026,1165.49 269.46,1165.49 C272.672,1165.49 275.618,1164.38 277.932,1162.53 L286.224,1170.69 C286.629,1171.09 287.284,1171.09 287.688,1170.69 C288.093,1170.3 288.093,1169.65 287.688,1169.25 L287.688,1169.25 Z" id="search" sketch:type="MSShapeGroup"> </path> </g> </g> </g></svg>`;
  searchButton.innerHTML = svg + " Search";
  searchButton.setAttribute("class", buttonClass);
  searchButton.title = "Search for instrument";
  searchButton.style.opacity = 1;

  form.appendChild(inputDepartment);
  form.appendChild(inputSearchType);
  form.appendChild(inputVolume);
  form.appendChild(inputPage);
  form.appendChild(searchButton);
  parent.appendChild(form);
}

/**
 * Evaluate the current page to determine whether to inject new elements
 **/
async function evaluate() {
  // Find the navigation menu and add a download button
  const buttonsMenu = document.querySelector("nav#primary div");
  if (buttonsMenu) {
    await addDownloadButton(buttonsMenu);
    await addSearchForm(buttonsMenu);
  }
}

/**
 * Download the document images as a PDF
 **/
async function download() {

  // Create a new jsPDF instance
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  // Define document variables
  let instrumentNumber = 0;
  let bookNumber = 0;
  let pageNumber = 0;
  let totalPages = 0;

  // Parse the document information
  const summary = document.querySelector("div.doc-preview-summary__columns");
  for (const column of summary.children) {
    for (const item of column.children) {
      const itemText = item.children[0].textContent.trim();
      const itemValue = item.children[1].textContent.trim();

      switch(itemText) {
          case "Instrument Number:":
            instrumentNumber = itemValue;
            break;
          case "Book:":
            bookNumber = itemValue;
            break;
          case "Page:":
            pageNumber = itemValue;
            break;
          case "Number of Pages:":
            totalPages = itemValue;
            break;
      }
    }
  }

  // Parse the first image URL
  const imageUrl = document.querySelector("article svg image").getAttribute("xlink:href");
  const result = imageUrl.matchAll(/(.+)_([\d]+)\.([\w]+)/gi);
  const matches = [...result][0];

  // Download the images
  if (matches.length == 4) {
    let baseUrl = matches[1];
    let extension = matches[3];

    // Fetch each image and add it to the PDF document
    for (let i = 1; i <= totalPages; i++) {
      let url = baseUrl + "_" + i + "." + extension;

      try{
        // Fetch the image
        const response = await fetch(url);
        const blob = await response.blob();
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });

        // Add the image as a new page
        if (i > 1) pdf.addPage();
        pdf.addImage(base64, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      }
      catch (error) {
        console.error("Error creating PDF: " + error);
      }
    }

    // Save the PDF document
    pdf.save(instrumentNumber + " - " + bookNumber + "-" + pageNumber + ".pdf");
  }
  else {
    console.log("Error while parsing the image URL");
  }
}
