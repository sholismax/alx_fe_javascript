document.addEventListener("DOMContentLoaded", () => {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    const addQuoteBtn = document.getElementById("addQuoteBtn");
    const newQuoteText = document.getElementById("newQuoteText");
    const newQuoteCategory = document.getElementById("newQuoteCategory");
    const categoryFilter = document.getElementById("categoryFilter");
    const conflictNotice = document.getElementById("conflictNotice");

    // Local data
    let quotes = JSON.parse(localStorage.getItem("quotes") || "[]");
    let selectedCategory = localStorage.getItem("selectedCategory") || "all";

    // Display random quote
    function showRandomQuote() {
        const filteredQuotes = selectedCategory === "all"
            ? quotes
            : quotes.filter(q => q.category === selectedCategory);

        quoteDisplay.textContent = filteredQuotes.length
            ? filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].text
            : "No quotes available for this category.";
    }

    // Add new quote locally
    function addQuote() {
        const text = newQuoteText.value.trim();
        const category = newQuoteCategory.value.trim();
        if (!text || !category) {
            alert("Please enter both quote and category.");
            return;
        }

        const newQuote = { text, category };
        quotes.push(newQuote);
        saveLocalQuotes();

        populateCategories();
        newQuoteText.value = "";
        newQuoteCategory.value = "";
        showRandomQuote();
    }

    // Save quotes to localStorage
    function saveLocalQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    // Populate categories
    function populateCategories() {
        const categories = ["all", ...new Set(quotes.map(q => q.category))];
        categoryFilter.innerHTML = "";
        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            categoryFilter.appendChild(option);
        });
        categoryFilter.value = categories.includes(selectedCategory) ? selectedCategory : "all";
        selectedCategory = categoryFilter.value;
    }

    // Filter quotes by category
    window.filterQuotes = function() {
        selectedCategory = categoryFilter.value;
        localStorage.setItem("selectedCategory", selectedCategory);
        showRandomQuote();
    }

    // Simulate server fetch
    async function fetchServerQuotes() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5"); // Mock API
            const serverData = await response.json();

            // Map server data to quote format
            const serverQuotes = serverData.map(item => ({
                text: item.title,
                category: item.userId.toString() // Just for demo purposes
            }));

            handleServerSync(serverQuotes);
        } catch (err) {
            console.error("Error fetching server data:", err);
        }
    }

    // Sync local and server data with conflict resolution
    function handleServerSync(serverQuotes) {
        let updated = false;

        serverQuotes.forEach(serverQuote => {
            // Check if quote exists locally
            const exists = quotes.some(localQuote => localQuote.text === serverQuote.text);
            if (!exists) {
                quotes.push(serverQuote);
                updated = true;
            }
        });

        if (updated) {
            saveLocalQuotes();
            populateCategories();
            showRandomQuote();

            if (conflictNotice) {
                conflictNotice.textContent = "New quotes from server have been added!";
                setTimeout(() => conflictNotice.textContent = "", 5000);
            }
        }
    }

    // Periodically sync every 30 seconds
    setInterval(fetchServerQuotes, 30000);

    // Event listeners
    newQuoteBtn.addEventListener("click", showRandomQuote);
    addQuoteBtn.addEventListener("click", addQuote);

    // Initialize
    populateCategories();
    showRandomQuote();
    fetchServerQuotes(); // initial fetch
});
