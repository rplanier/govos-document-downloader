// ==UserScript==
// @name          GovOS Document Downloader
// @author        rplanier
// @source        https://www.github.com/rplanier/govos-document-downloader
// @description   Adds a download button to the GovOS document summary page and compiles all watermarked pages into a single PDF for download.
// @version       0.0.1a
// @match         *://*.publicsearch.us/*
// @run-at        document-end
// @require       https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js
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

// Evaluate the current page
evaluate();

/**
 * Add a download button if on the document summary page
 **/
async function evaluate() {
  console.log("Loaded");

  // Find the navigation menu and add a download button
  const buttonsMenu = document.querySelector("nav#primary div");
  if (buttonsMenu) {
    // Determine the existing button classes
    const buttonClass = buttonsMenu.lastChild.className;

    // Create a download button
    let b = document.createElement("button");
    const svg =`<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20" style="margin-right: 6px;"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z" fill="#FFFFFF"></path> </g></svg>`;
    b.innerHTML = svg + " Download";
    b.setAttribute("class", buttonClass);
    b.style.opacity = 1;
    b.onclick = function() {
      download();
    };

    // Append the button to the menu
    buttonsMenu.appendChild(b);
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
