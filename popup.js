document.addEventListener("DOMContentLoaded", () => {
    const PASSWORD = "securepassword123"; // Set your secure password here

    const loginScreen = document.getElementById("login-screen");
    const whitelistScreen = document.getElementById("whitelist-screen");
    const passwordInput = document.getElementById("password-input");
    const loginButton = document.getElementById("login-button");
    const loginError = document.getElementById("login-error");
    const addUrlButton = document.getElementById("add-url");
    const urlInput = document.getElementById("url-input");
    const whitelistContainer = document.getElementById("whitelist");
    const logoutButton = document.getElementById("logout-button");

    function authenticate() {
        const enteredPassword = passwordInput.value;
        if (enteredPassword === PASSWORD) {
            loginScreen.classList.add("hidden");
            whitelistScreen.classList.remove("hidden");
        } else {
            loginError.style.display = "block";
        }
    }

    function logout() {
        whitelistScreen.classList.add("hidden");
        loginScreen.classList.remove("hidden");
        passwordInput.value = "";
        loginError.style.display = "none";
    }

    function updateWhitelistDisplay() {
        chrome.declarativeNetRequest.getDynamicRules((rules) => {
            whitelistContainer.innerHTML = "";
            rules.forEach((rule) => {
                const listItem = document.createElement("li");
                listItem.textContent = rule.condition.urlFilter;

                const removeButton = document.createElement("button");
                removeButton.textContent = "Remove";
                removeButton.style.marginLeft = "10px";
                removeButton.addEventListener("click", () => removeUrl(rule.id));

                listItem.appendChild(removeButton);
                whitelistContainer.appendChild(listItem);
            });
        });
    }

    function addUrl() {
        let url = urlInput.value.trim();
        if (!url) {
            alert("Please enter a valid URL or pattern.");
            return;
        }

        if (!url.startsWith("http")) {
            url = `https://${url}`;
        }
        if (!url.endsWith("/*")) {
            url += "/*";
        }

        const ruleId = Math.floor(Date.now() / 1000); // Unique integer ID
        chrome.declarativeNetRequest.updateDynamicRules(
            {
                addRules: [
                    {
                        id: ruleId,
                        priority: 1,
                        action: { type: "allow" },
                        condition: { urlFilter: url, resourceTypes: ["main_frame"] }
                    }
                ]
            },
            () => {
                updateWhitelistDisplay();
                urlInput.value = "";
            }
        );
    }

    function removeUrl(ruleId) {
        chrome.declarativeNetRequest.updateDynamicRules(
            { removeRuleIds: [ruleId] },
            updateWhitelistDisplay
        );
    }

    loginButton.addEventListener("click", authenticate);
    logoutButton.addEventListener("click", logout);
    addUrlButton.addEventListener("click", addUrl);

    updateWhitelistDisplay();
});
