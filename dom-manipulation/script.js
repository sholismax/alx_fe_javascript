document.addEventListener("DOMContentLoaded", () => {
    // Select DOM elements
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    const addQuoteBtn = document.getElementById("addQuoteBtn");
    const newQuoteText = document.getElementById("newQuoteText");
    const newQuoteCategory = document.getElementById("newQuoteCategory");
    const categoryFilter = document.getElementById("categoryFilter");
    const exportBtn = document.getElementById("exportQuotesBtn");
    const importFile = document.getElementById("importFile");

    // Load quotes from local storage or initialize
    let quotes = JSON.parse(localStorage.getItem("quotes") || "[]");

    // Load last selected filter from local storage
    let currentFilter = localStorage.getItem("lastFilter") || "all";
    categoryFilter.value = currentFilter;

    // Display a random quote based on filter
    function showRandomQuote() {
        const filteredQuotes = currentFilter === "all"
            ? quotes
            : quotes.filter(q => q.category === currentFilter);

        if (filteredQuotes.length === 0) {
            quoteDisplay.textContent = "No quotes available for this category.";
            return;
        }

        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        quoteDisplay.textContent = filteredQuotes[randomIndex].text;
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
        saveQuotes();
        populateCategories();
        newQuoteText.value = "";
        newQuoteCategory.value = "";
        showRandomQuote();
    }

    // Save quotes to local storage
    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    // Populate category dropdown dynamically
    function populateCategories() {
        const categories = ["all", ...new Set(quotes.map(q => q.category))];
        categoryFilter.innerHTML = categories.map(cat =>
            `<option value="${cat}">${cat}</option>`
        ).join("");

        // Restore previously selected filter
        if (categories.includes(currentFilter)) {
            categoryFilter.value = currentFilter;
        } else {
            currentFilter = "all";
            categoryFilter.value = "all";
        }
    }

    // Filter quotes based on selected category
    window.filterQuotes = function() {
        currentFilter = categoryFilter.value;
        localStorage.setItem("lastFilter", currentFilter);
        showRandomQuote();
    }

    // Export quotes as JSON
    exportBtn.addEventListener("click", () => {
        const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "quotes.json";
        a.click();
        URL.revokeObjectURL(url);
    });

    // Import quotes from JSON file
    importFile.addEventListener("change", (event) => {
        const fileReader = new FileReader();
        fileReader.onload = function(e) {
            try {
                const importedQuotes = JSON.parse(e.target.result);
                quotes.push(...importedQuotes);
                saveQuotes();
                populateCategories();
                alert("Quotes imported successfully!");
                showRandomQuote();
            } catch {
                alert("Invalid JSON file.");
            }
        }
        fileReader.readAsText(event.target.files[0]);
    });

    // Event listeners
    newQuoteBtn.addEventListener("click", showRandomQuote);
    addQuoteBtn.addEventListener("click", addQuote);

    // Initialize
    populateCategories();
    showRandomQuote();
});
