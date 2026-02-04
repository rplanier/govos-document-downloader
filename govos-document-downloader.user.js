// ==UserScript==
// @name          GovOS Document Downloader
// @author        Preston Lanier (preston@lanier.email)
// @namespace     https://www.github.com/rplanier
// @source        https://www.github.com/rplanier/govos-document-downloader
// @description   Adds a download button to the GovOS document summary page and compiles all watermarked pages into a single PDF for download.
// @version       0.2.1
// @match         *://*.publicsearch.us/*
// @run-at        document-end
// @require       https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js
// @icon          https://eddy.nm.publicsearch.us/img/favicon-32x32.png
// @updateURL     https://raw.githubusercontent.com/rplanier/govos-document-downloader/master/govos-document-downloader.user.js
// @downloadURL   https://raw.githubusercontent.com/rplanier/govos-document-downloader/master/govos-document-downloader.user.js
// @supportURL    https://github.com/rplanier/govos-document-downloader/issues
// ==/UserScript==

// Declare global variables
let county = "";
let domain = "";
let state = "";
let downloadButton, searchButton;

// Create a mutation observer to detect page changes
new MutationObserver(items => {
    evaluate();
  }).observe(
    document.querySelector("title"), {
      subtree: true,
      childList: true
    }
  );

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
  let svg = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="18" height="18" style="margin-right: 6px;"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z" fill="#FFFFFF"></path> </g></svg>`;
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
  form.style.display = "flex";

  let inputInstNo = document.createElement("input");
  inputInstNo.type = "text";
  inputInstNo.placeholder = "Inst. No.";
  inputInstNo.style.width = "70px";
  inputInstNo.style.border = "thin solid #CCC";
  inputInstNo.style.padding = "8px";
  inputInstNo.style.marginRight = "8px";

  let inputVolume = document.createElement("input");
  inputVolume.type = "text";
  inputVolume.placeholder = "Volume";
  inputVolume.style.width = "50px";
  inputVolume.style.border = "thin solid #CCC";
  inputVolume.style.padding = "8px";
  inputVolume.style.marginRight = "8px";

  let inputPage = document.createElement("input");
  inputPage.type = "text";
  inputPage.placeholder = "Page";
  inputPage.style.width = "50px";
  inputPage.style.border = "thin solid #CCC";
  inputPage.style.padding = "8px";
  inputPage.style.marginRight = "8px";

  searchButton = document.createElement("button");
  let svg = `<svg viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#FFFFFF" width="18" height="18" style="margin-right: 6px;" stroke="#FFFFFF"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>search</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage"> <g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-256.000000, -1139.000000)" fill="#FFFFFF"> <path d="M269.46,1163.45 C263.17,1163.45 258.071,1158.44 258.071,1152.25 C258.071,1146.06 263.17,1141.04 269.46,1141.04 C275.75,1141.04 280.85,1146.06 280.85,1152.25 C280.85,1158.44 275.75,1163.45 269.46,1163.45 L269.46,1163.45 Z M287.688,1169.25 L279.429,1161.12 C281.591,1158.77 282.92,1155.67 282.92,1152.25 C282.92,1144.93 276.894,1139 269.46,1139 C262.026,1139 256,1144.93 256,1152.25 C256,1159.56 262.026,1165.49 269.46,1165.49 C272.672,1165.49 275.618,1164.38 277.932,1162.53 L286.224,1170.69 C286.629,1171.09 287.284,1171.09 287.688,1170.69 C288.093,1170.3 288.093,1169.65 287.688,1169.25 L287.688,1169.25 Z" id="search" sketch:type="MSShapeGroup"> </path> </g> </g> </g></svg>`;
  searchButton.innerHTML = svg + " Search";
  searchButton.setAttribute("class", buttonClass);
  searchButton.title = "Search for instrument";
  searchButton.style.opacity = 1;

  // Handle form submission
  form.onsubmit = function(e) {
    e.preventDefault();
    let today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    let url = "https://" + domain + "/results?department=RP&recordedDateRange=16000101%2C" + today + "&searchType=advancedSearch";

    const instNo = inputInstNo.value.trim();
    const volume = inputVolume.value.trim();
    const page = inputPage.value.trim();

    if (instNo) {
      // Format instrument number as JSON array
      const instArray = JSON.stringify([instNo]);
      url += "&documentNumberRange=" + encodeURIComponent(instArray);
    }
    if (volume) {
      url += "&volume=" + encodeURIComponent(volume);
    }
    if (page) {
      url += "&page=" + encodeURIComponent(page);
    }

    window.location.href = url;
  };

  form.appendChild(inputInstNo);
  form.appendChild(inputVolume);
  form.appendChild(inputPage);
  form.appendChild(searchButton);
  parent.appendChild(form);
}

/**
 * Get the Redux store from React internals
 * Tries multiple entry points and patterns for robustness
 **/
function getReduxStore() {
  // Try multiple possible entry point selectors
  const selectors = [
    'div.doc-preview__summary',
    'article',
    'div.doc-preview-summary__columns',
    'main',
    '#root'
  ];

  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (!el) continue;

    const reactKey = Object.keys(el).find(k => k.startsWith('__reactInternal') || k.startsWith('__reactFiber'));
    if (!reactKey) continue;

    let node = el[reactKey];
    // Traverse up the React fiber tree to find the store
    for (let i = 0; i < 40; i++) {
      if (!node) break;
      // Check pendingProps.store
      if (node.pendingProps?.store?.getState) {
        return node.pendingProps.store;
      }
      // Check memoizedState patterns
      const ms = node.memoizedState;
      if (ms?.store?.getState) {
        return ms.store;
      }
      if (ms?.memoizedState?.[0]?.store?.getState) {
        return ms.memoizedState[0].store;
      }
      if (ms?.element?.props?.store?.getState) {
        return ms.element.props.store;
      }
      node = node.return;
    }
  }
  return null;
}

/**
 * Download the document images as a PDF
 **/
async function download() {
  // Get image URLs from Redux store
  const store = getReduxStore();
  if (!store) {
    console.error("Could not access Redux store");
    return;
  }

  const docData = store.getState().docPreview?.document?.data;
  if (!docData) {
    console.error("Could not access document data");
    return;
  }

  const imageUrls = docData.imageUrls;
  if (!imageUrls || imageUrls.length === 0) {
    console.error("No image URLs found in document data");
    return;
  }

  // Prompt for the filename
  let fileName = prompt("Save file as:", getDocumentName(docData));
  if (!fileName) {
    return;
  }

  // Ensure .pdf extension
  if (!fileName.toLowerCase().endsWith(".pdf")) {
    fileName += ".pdf";
  }

  console.log("Compiling page preview images. Please wait...");

  // Create a new jsPDF instance
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  // Fetch each image and add it to the PDF document
  for (let i = 0; i < imageUrls.length; i++) {
    try {
      const response = await fetch(imageUrls[i]);
      const blob = await response.blob();
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });

      // Convert to greyscale JPEG for smaller file size
      const compressed = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.filter = 'grayscale(1)';
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = base64;
      });

      // Add the image as a new page
      if (i > 0) pdf.addPage();
      pdf.addImage(compressed, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
    } catch (error) {
      console.error("Error adding page " + (i + 1) + ": " + error);
    }
  }

  // Save the PDF document
  pdf.save(fileName);
}

/**
 * Evaluate the current page to determine whether to inject new elements
 **/
async function evaluate() {
  // Find the navigation menu and add a download button
  const buttonsMenu = document.querySelector("nav#primary div");
  if (buttonsMenu && !downloadButton?.isConnected) {
    // Parse the document information
    parseDocumentInfo();

    console.log("GovOS Document Downloader is running (" + county + " County, " + state + ")");

    // Insert the download button and search form
    await addDownloadButton(buttonsMenu);
    await addSearchForm(buttonsMenu);
  }
}

/**
 * Generate the default document name based upon Redux store data
 **/
function getDocumentName(docData) {
  let fileNameParts = [];

  const caseNumber = docData.caseNumber || "";
  const documentNumber = docData.instrumentNumber || docData.docNumber || "";
  const volumeNumber = docData.volume || "";
  const pageNumber = docData.page || "";

  if (caseNumber) {
    fileNameParts.push("Cause No. " + caseNumber);
  } else {
    if (documentNumber) {
      fileNameParts.push(documentNumber);
    }

    if (volumeNumber && pageNumber) {
      fileNameParts.push("V" + volumeNumber + " P" + pageNumber);
    }
  }

  fileNameParts.push(county + " " + state);

  return fileNameParts.join("_") + ".pdf";
}

/**
 * Parse the county and state from the URL domain
 **/
function parseDocumentInfo() {
  // Determine the URL domain
  const url = new URL(window.location.href);
  domain = url.hostname;

  // Determine the county and state
  const parts = domain.split(".");
  const countyParts = parts[0].toLowerCase().split(" ");
  for (let i = 0; i < countyParts.length; i++) {
    countyParts[i] = countyParts[i].charAt(0).toUpperCase() + countyParts[i].substring(1);
  }
  county = countyParts.join(" ");
  state = parts[1].toUpperCase();
}
