document.addEventListener("DOMContentLoaded", () => {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteBtn = document.getElementById("newQuote");
    const addQuoteBtn = document.getElementById("addQuoteBtn");
    const newQuoteText = document.getElementById("newQuoteText");
    const newQuoteCategory = document.getElementById("newQuoteCategory");
    const categoryFilter = document.getElementById("categoryFilter");
    const conflictNotice = document.getElementById("conflictNotice");

    let quotes = JSON.parse(localStorage.getItem("quotes") || "[]");
    let selectedCategory = localStorage.getItem("selectedCategory") || "all";

    function showRandomQuote() {
        const filteredQuotes = selectedCategory === "all"
            ? quotes
            : quotes.filter(q => q.category === selectedCategory);

        quoteDisplay.textContent = filteredQuotes.length
            ? filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].text
            : "No quotes available for this category.";
    }

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

        // Sync the new quote to server via POST
        postQuoteToServer(newQuote);
    }

    function saveLocalQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

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

    window.filterQuotes = function() {
        selectedCategory = categoryFilter.value;
        localStorage.setItem("selectedCategory", selectedCategory);
        showRandomQuote();
    }

    async function fetchQuotesFromServer() {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
            const serverData = await response.json();

            const serverQuotes = serverData.map(item => ({
                text: item.title,
                category: item.userId.toString()
            }));

            handleServerSync(serverQuotes);
        } catch (err) {
            console.error("Error fetching server data:", err);
        }
    }

    function handleServerSync(serverQuotes) {
        let updated = false;
        serverQuotes.forEach(serverQuote => {
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

    async function postQuoteToServer(quote) {
        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(quote)
            });

            const result = await response.json();
            console.log("Quote successfully posted to server:", result);
        } catch (err) {
            console.error("Error posting quote to server:", err);
        }
    }

    // Periodic server sync
    setInterval(fetchQuotesFromServer, 30000);

    newQuoteBtn.addEventListener("click", showRandomQuote);
    addQuoteBtn.addEventListener("click", addQuote);

    populateCategories();
    showRandomQuote();
    fetchQuotesFromServer();
});

