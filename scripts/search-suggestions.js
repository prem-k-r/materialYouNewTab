/*
 * Material You NewTab
 * Copyright (c) 2023-2025 XengShi
 * Licensed under the GNU General Public License v3.0 (GPL-3.0)
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <https://www.gnu.org/licenses/>.
 */

// --------------------------------- Proxy ---------------------------------
let proxyurl;
document.addEventListener("DOMContentLoaded", () => {
    const userProxyInput = document.getElementById("userproxy");
    const saveProxyButton = document.getElementById("saveproxy");
    const savedProxy = localStorage.getItem("proxy");

    const defaultProxyURL = "https://mynt-proxy.rhythmcorehq.com/proxy?url="; //Default proxy url

    if (savedProxy && savedProxy !== defaultProxyURL) {
        userProxyInput.value = savedProxy;
    }

    // Allow pressing Enter to save the proxy
    userProxyInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            saveProxyButton.click();
        }
    });

    // Save the proxy to localStorage
    saveProxyButton.addEventListener("click", () => {
        proxyurl = userProxyInput.value.trim();

        // If the input is empty, use the default proxy.
        if (proxyurl === "") {
            proxyurl = defaultProxyURL;
        } else {
            // Validate if input starts with "http://" or "https://"
            if (!(proxyurl.startsWith("http://") || proxyurl.startsWith("https://"))) {
                proxyurl = "https://" + proxyurl;
            }
        }
        // Set the proxy in localStorage, clear the input, and reload the page
        localStorage.setItem("proxy", proxyurl);
        userProxyInput.value = "";
        location.reload();
    });

    // Determine which proxy URL to use
    proxyurl = savedProxy || defaultProxyURL;
});

// ---------------------------- Search Suggestions ----------------------------

let lastInteractionBy = null;
const resultBox = document.getElementById("resultBox");

// Show the result box
function showResultBox() {
    resultBox.classList.add("show");
    resultBox.style.display = "block";
}

// Hide the result box
function hideResultBox() {
    resultBox.classList.remove("show");
    //resultBox.style.display = "none";
}

showResultBox();
hideResultBox();

const languageCode = (localStorage.getItem("selectedLanguage") || "en").slice(0, 2);
document.getElementById("searchQ").addEventListener("input", async function () {
    const searchsuggestionscheckbox = document.getElementById("searchsuggestionscheckbox");
    if (searchsuggestionscheckbox.checked) {
        var selectedOption = document.querySelector("input[name='search-engine']:checked").value;
        var searchEngines = {
            engine1: "https://www.google.com/search?q=",
            engine2: "https://duckduckgo.com/?q=",
            engine3: "https://bing.com/?q=",
            engine4: "https://search.brave.com/search?q=",
            engine5: "https://www.youtube.com/results?search_query=",
            engine6: "https://www.google.com/search?tbm=isch&q=",
            engine7: "https://www.reddit.com/search/?q=",
            engine8: `https://${languageCode}.wikipedia.org/wiki/Special:Search?search=`,
            engine9: "https://www.quora.com/search?q="
        };
        const query = this.value;

        if (query.length > 0) {
            try {
                // Fetch autocomplete suggestions
                const suggestions = await getAutocompleteSuggestions(query);

                if (suggestions === "") {
                    hideResultBox();
                } else {
                    // Clear the result box
                    resultBox.innerHTML = "";

                    // Add suggestions to the result box
                    suggestions.forEach((suggestion, index) => {
                        const resultItem = document.createElement("div");
                        resultItem.classList.add("resultItem");
                        resultItem.textContent = suggestion;
                        resultItem.setAttribute("data-index", index);

                        resultItem.onclick = () => {
                            if (selectedOption === "engine0") {
                                try {
                                    if (isFirefox) {
                                        browser.search.query({ text: suggestion });
                                    } else {
                                        chrome.search.query({ text: suggestion });
                                    }
                                } catch (error) {
                                    var fallbackUrl = searchEngines.engine1 + encodeURIComponent(suggestion);
                                    window.location.href = fallbackUrl;
                                }
                            } else {
                                var resultlink = searchEngines[selectedOption] + encodeURIComponent(suggestion);
                                window.location.href = resultlink;
                            }
                        };

                        resultItem.addEventListener("mouseenter", () => {
                            // Remove existing highlight
                            const currentlyActive = resultBox.querySelector(".active");
                            if (currentlyActive) currentlyActive.classList.remove("active");

                            // Mark this as active
                            resultItem.classList.add("active");
                            lastInteractionBy = "mouse";
                        });

                        resultBox.appendChild(resultItem);
                    });

                    // Check if the dropdown of search shortcut is open
                    const dropdown = document.querySelector(".dropdown-content");

                    if (dropdown.style.display === "block") {
                        dropdown.style.display = "none";
                    }
                    showResultBox();
                }
            } catch (error) {
                // Handle the error (if needed)
            }
        } else {
            hideResultBox();
        }
    }
});

const searchInputElem = document.getElementById("searchQ");
let lastTypedValue = "";
let lastSuggestionValue = "";
let suggestionActiveIndex = -1;

searchInputElem.addEventListener("keydown", function (e) {
    lastInteractionBy = "keyboard";
    const suggestions = Array.from(resultBox.children);
    const hasSuggestions = suggestions.length > 0;
    const isArrowDown = e.key === "ArrowDown";
    const isArrowUp = e.key === "ArrowUp";
    const isTab = e.key === "Tab";
    const isEnter = e.key === "Enter";
    const isArrowRight = e.key === "ArrowRight";

    if (hasSuggestions && (isArrowDown || isArrowUp)) {
        e.preventDefault();
        // Remove previous highlight
        if (suggestionActiveIndex >= 0 && suggestionActiveIndex < suggestions.length) {
            suggestions[suggestionActiveIndex].classList.remove("active");
        }
        // On first arrow, save the current input value
        if (suggestionActiveIndex === -1) {
            lastTypedValue = this.value;
        }
        // Move index
        if (isArrowDown) {
            suggestionActiveIndex = (suggestionActiveIndex + 1) % suggestions.length;
        } else if (isArrowUp) {
            suggestionActiveIndex = (suggestionActiveIndex - 1 + suggestions.length) % suggestions.length;
        }
        // Highlight new suggestion
        const activeSuggestion = suggestions[suggestionActiveIndex];
        activeSuggestion.classList.add("active");
        activeSuggestion.scrollIntoView({ behavior: "smooth", block: "nearest" });
        // Write suggestion text into input (like Chrome)
        lastSuggestionValue = activeSuggestion.textContent;
        this.value = lastSuggestionValue;
        // Move cursor to end
        this.setSelectionRange(this.value.length, this.value.length);
    } else if (hasSuggestions && (isTab || isArrowRight)) {
        const activeSuggestion = suggestions[suggestionActiveIndex];
        if (activeSuggestion) {
            e.preventDefault();
            this.value = activeSuggestion.textContent;
            this.setSelectionRange(this.value.length, this.value.length);
        }
    } else if (hasSuggestions && isEnter) {
        const activeSuggestion = suggestions[suggestionActiveIndex];
        if (activeSuggestion) {
            e.preventDefault();
            lastInteractionBy = "keyboard";
            activeSuggestion.click();
        }
    } else if (!hasSuggestions && (isArrowDown || isArrowUp)) {
        suggestionActiveIndex = -1;
    }
});

// Restore input value if user types or presses Backspace/Escape
searchInputElem.addEventListener("input", function () {
    suggestionActiveIndex = -1;
});
searchInputElem.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        suggestionActiveIndex = -1;
        this.value = lastTypedValue || this.value;
        hideResultBox();
    } else if (!["ArrowDown", "ArrowUp", "Tab", "Enter", "ArrowRight"].includes(e.key)) {
        suggestionActiveIndex = -1;
    }
});

// Check for different browsers and return the corresponding client parameter
function getClientParam() {
    if (isFirefox) return "firefox";
    if (isOpera) return "opera";
    if (isChromiumBased) return "chrome";
    if (isSafari) return "safari";
    return "firefox"; // Default to Firefox if the browser is not recognized
}

let lastRedditRequestTime = 0;

async function getAutocompleteSuggestions(query) {
    const clientParam = getClientParam(); // Get the browser client parameter dynamically
    var selectedOption = document.querySelector('input[name="search-engine"]:checked').value;

    // 🔒 Throttle Reddit API calls
    const now = Date.now();
    if (selectedOption === "engine7" && now - lastRedditRequestTime < 1000) {
        return []; // skip call if within 1 second
    }
    if (selectedOption === "engine7") {
        lastRedditRequestTime = now;
    }

    var searchEnginesapi = {
        engine0: `https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&type=list`,
        engine1: `https://www.google.com/complete/search?client=${clientParam}&q=${encodeURIComponent(query)}`,
        engine2: `https://duckduckgo.com/ac/?q=${encodeURIComponent(query)}&type=list`,
        engine4: `https://search.brave.com/api/suggest?q=${encodeURIComponent(query)}&rich=true&source=web`,
        engine5: `https://www.google.com/complete/search?client=${clientParam}&ds=yt&q=${encodeURIComponent(query)}`,
        engine7: `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=relevance&limit=15`,
        engine8: `https://${languageCode}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&format=json`
    };

    const useproxyCheckbox = document.getElementById("useproxyCheckbox");
    let apiUrl = searchEnginesapi[selectedOption] || searchEnginesapi["engine1"];
    if (useproxyCheckbox.checked && selectedOption !== "engine7") {
        apiUrl = proxyurl + encodeURIComponent(apiUrl);
    }

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (selectedOption === "engine4") {
            const suggestions = data[1].map(item => {
                if (item.is_entity) {
                    return `${item.q} - ${item.name} (${item.category ? item.category : "No category"})`;
                } else {
                    return item.q;
                }
            });
            return suggestions;
        } else if (selectedOption === "engine7") {
            const suggestions = [];
            if (data && data.data && data.data.children) {
                data.data.children.forEach(post => {
                    if (post.data && post.data.title) {
                        const subreddit = post.data.subreddit_name_prefixed;
                        suggestions.push(`${post.data.title} (${subreddit})`);
                    }
                });
            }
            return suggestions;
        } else {

            return data[1];
        }
    } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error);
        return [];
    }
}

// Hide results when clicking outside
document.addEventListener("click", function (event) {
    if (!searchbar.contains(event.target)) {
        hideResultBox();
    }
});

// ------------------------- Toggles --------------------------
document.addEventListener("DOMContentLoaded", function () {
    const searchsuggestionscheckbox = document.getElementById("searchsuggestionscheckbox");
    const proxybypassField = document.getElementById("proxybypassField");
    const proxyinputField = document.getElementById("proxyField");
    const useproxyCheckbox = document.getElementById("useproxyCheckbox");

    // This function shows the proxy disclaimer.
    async function showProxyDisclaimer() {
        const message = translations[currentLanguage]?.ProxyDisclaimer || translations["en"].ProxyDisclaimer;
        return await confirmPrompt(message, agreeText, cancelText);
    }

    // Requests optional host permissions for suggestion APIs
    async function requestHostPermissions() {
        return new Promise((resolve) => {
            chrome.permissions.request({
                origins: [
                    "https://www.google.com/complete/search?client=*",
                    "https://duckduckgo.com/ac/?q=*",
                    "https://search.brave.com/api/suggest?q=*",
                    "https://*.wikipedia.org/w/api.php?action=opensearch&search=*"
                ]
            }, (granted) => {
                resolve(granted);
            });
        });
    }

    // Add change event listeners for the checkboxes
    searchsuggestionscheckbox.addEventListener("change", async function () {
        saveCheckboxState("searchsuggestionscheckboxState", searchsuggestionscheckbox);
        if (searchsuggestionscheckbox.checked) {
            proxybypassField.classList.remove("inactive");
            saveActiveStatus("proxybypassField", "active");

            if (!isFirefoxAll) {
                await requestHostPermissions();
            }
        } else {
            proxybypassField.classList.add("inactive");
            saveActiveStatus("proxybypassField", "inactive");
            useproxyCheckbox.checked = false;
            saveCheckboxState("useproxyCheckboxState", useproxyCheckbox);
            proxyinputField.classList.add("inactive");
            saveActiveStatus("proxyinputField", "inactive");
        }
    });

    useproxyCheckbox.addEventListener("change", async function () {
        if (useproxyCheckbox.checked) {
            // Show the disclaimer and check the user's choice
            const userConfirmed = await showProxyDisclaimer();
            if (userConfirmed) {
                // Only enable the proxy if the user confirmed
                saveCheckboxState("useproxyCheckboxState", useproxyCheckbox);
                proxyinputField.classList.remove("inactive");
                saveActiveStatus("proxyinputField", "active");
            } else {
                // Revert the checkbox state if the user did not confirm
                useproxyCheckbox.checked = false;
            }
        } else {
            // If the checkbox is unchecked, disable the proxy
            saveCheckboxState("useproxyCheckboxState", useproxyCheckbox);
            proxyinputField.classList.add("inactive");
            saveActiveStatus("proxyinputField", "inactive");
        }
    });

    // Load and apply the saved checkbox states and display statuses
    loadCheckboxState("searchsuggestionscheckboxState", searchsuggestionscheckbox);
    loadCheckboxState("useproxyCheckboxState", useproxyCheckbox);
    loadActiveStatus("proxyinputField", proxyinputField);
    loadActiveStatus("proxybypassField", proxybypassField);
});
