document.addEventListener("DOMContentLoaded", () => {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    const addQuoteBtn = document.getElementById("addQuoteBtn");
    const newQuoteText = document.getElementById("newQuoteText");
    const newQuoteCategory = document.getElementById("newQuoteCategory");
    const categoryFilter = document.getElementById("categoryFilter");

    // Load quotes from localStorage or use default
    let quotes = JSON.parse(localStorage.getItem("quotes") || "[]");

    // Load last selected filter
    let currentFilter = localStorage.getItem("lastFilter") || "all";
    categoryFilter.value = currentFilter;

    // Display a random quote based on current filter
    function showRandomQuote() {
        const filteredQuotes = currentFilter === "all"
            ? quotes
            : quotes.filter(q => q.category === currentFilter);

        quoteDisplay.textContent = filteredQuotes.length
            ? filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].text
            : "No quotes available for this category.";
    }

    // Add a new quote
    function addQuote() {
        const text = newQuoteText.value.trim();
        const category = newQuoteCategory.value.trim();

        if (!text || !category) {
            alert("Please enter both quote and category.");
            return;
        }

        quotes.push({ text, category });
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories();
        newQuoteText.value = "";
        newQuoteCategory.value = "";
        showRandomQuote();
    }

    // Populate categories dynamically
    function populateCategories() {
        const categories = ["all", ...new Set(quotes.map(q => q.category))];
        categoryFilter.innerHTML = categories
            .map(cat => `<option value="${cat}">${cat}</option>`)
            .join("");
        if (categories.includes(currentFilter)) {
            categoryFilter.value = currentFilter;
        } else {
            currentFilter = "all";
            categoryFilter.value = "all";
        }
    }

    // Filter quotes when category is selected
    window.filterQuotes = function() {
        currentFilter = categoryFilter.value;
        localStorage.setItem("lastFilter", currentFilter);
        showRandomQuote();
    }

    // Event listeners
    newQuoteBtn.addEventListener("click", showRandomQuote);
    addQuoteBtn.addEventListener("click", addQuote);

    // Initialize
    populateCategories();
    showRandomQuote();
});
