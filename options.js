// options.js

document.addEventListener("DOMContentLoaded", () => {
    const whitelistKey = "whitelistedURLs";
    const urlInput = document.getElementById("url-input");
    const addUrlButton = document.getElementById("add-url");
    const whitelistContainer = document.getElementById("whitelist");
  
    // Function to update the displayed whitelist
    function updateWhitelistDisplay() {
      chrome.storage.local.get([whitelistKey], (result) => {
        const whitelist = result[whitelistKey] || [];
        whitelistContainer.innerHTML = ""; // Clear current list
        whitelist.forEach((url, index) => {
          const listItem = document.createElement("li");
          listItem.textContent = url;
  
          const removeButton = document.createElement("button");
          removeButton.textContent = "Remove";
          removeButton.style.marginLeft = "10px";
          removeButton.addEventListener("click", () => removeUrl(index));
  
          listItem.appendChild(removeButton);
          whitelistContainer.appendChild(listItem);
        });
      });
    }
  
    // Add URL to the whitelist
    addUrlButton.addEventListener("click", () => {
      const url = urlInput.value.trim();
      if (url) {
        chrome.storage.local.get([whitelistKey], (result) => {
          const whitelist = result[whitelistKey] || [];
          if (!whitelist.includes(url)) {
            whitelist.push(url);
            chrome.storage.local.set({ [whitelistKey]: whitelist }, () => {
              updateWhitelistDisplay();
              urlInput.value = ""; // Clear input field
            });
          } else {
            alert("URL is already in the whitelist.");
          }
        });
      }
    });
  
    // Remove URL from the whitelist
    function removeUrl(index) {
      chrome.storage.local.get([whitelistKey], (result) => {
        const whitelist = result[whitelistKey] || [];
        whitelist.splice(index, 1); // Remove the URL at the specified index
        chrome.storage.local.set({ [whitelistKey]: whitelist }, () => {
          updateWhitelistDisplay();
        });
      });
    }
  
    // Initial display update
    updateWhitelistDisplay();
  });
  