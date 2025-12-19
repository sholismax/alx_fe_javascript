document.addEventListener("DOMContentLoaded", () => {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    const addQuoteBtn = document.getElementById("addQuoteBtn");
    const newQuoteText = document.getElementById("newQuoteText");
    const newQuoteCategory = document.getElementById("newQuoteCategory");
    const categoryFilter = document.getElementById("categoryFilter");

    // Load quotes from localStorage or start with empty array
    let quotes = JSON.parse(localStorage.getItem("quotes") || "[]");

    // Load last selected filter
    let currentFilter = localStorage.getItem("lastFilter") || "all";

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

        // Add quote to array and save to localStorage
        const newQuote = { text, category };
        quotes.push(newQuote);
        localStorage.setItem("quotes", JSON.stringify(quotes));

        // Update category dropdown if new category
        populateCategories();

        // Clear input fields
        newQuoteText.value = "";
        newQuoteCategory.value = "";

        // Display a new random quote
        showRandomQuote();
    }

    // Populate categories dynamically
    function populateCategories() {
        const categories = ["all", ...new Set(quotes.map(q => q.category))];

        // Clear existing options
        categoryFilter.innerHTML = "";

        // Create and append new options
        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            categoryFilter.appendChild(option);
        });

        // Restore last filter
        categoryFilter.value = categories.includes(currentFilter) ? currentFilter : "all";
        currentFilter = categoryFilter.value;
    }

    // Filter quotes when category changes
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
