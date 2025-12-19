document.addEventListener("DOMContentLoaded", function () {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");

    // Load quotes from Local Storage or use default quotes
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
        { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
        { text: "Success is not final, failure is not fatal.", category: "Inspiration" }
    ];

    // Save quotes to Local Storage
    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    // Display a random quote
    function showRandomQuote() {
        if (quotes.length === 0) {
            quoteDisplay.textContent = "No quotes available.";
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];

        quoteDisplay.innerHTML = `
            <p>"${quote.text}"</p>
            <small>Category: ${quote.category}</small>
        `;

        // Store last viewed quote in Session Storage
        sessionStorage.setItem("lastQuote", JSON.stringify(quote));
    }

    // Create Add Quote form dynamically
    function createAddQuoteForm() {
        const container = document.createElement("div");

        const quoteInput = document.createElement("input");
        quoteInput.type = "text";
        quoteInput.placeholder = "Enter a new quote";

        const categoryInput = document.createElement("input");
        categoryInput.type = "text";
        categoryInput.placeholder = "Enter quote category";

        const addButton = document.createElement("button");
        addButton.textContent = "Add Quote";

        addButton.onclick = function () {
            addQuote(quoteInput.value, categoryInput.value);
            quoteInput.value = "";
            categoryInput.value = "";
        };

        container.appendChild(quoteInput);
        container.appendChild(categoryInput);
        container.appendChild(addButton);

        document.body.appendChild(container);
    }

    // Add new quote
    function addQuote(text, category) {
        if (text.trim() === "" || category.trim() === "") {
            alert("Please enter both a quote and a category.");
            return;
        }

        quotes.push({
            text: text.trim(),
            category: category.trim()
        });

        saveQuotes();
        showRandomQuote();
    }

    // Export quotes as JSON
    function exportQuotes() {
        const blob = new Blob([JSON.stringify(quotes, null, 2)], {
            type: "application/json"
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "quotes.json";
        link.click();

        URL.revokeObjectURL(url);
    }

    // Import quotes from JSON file
    window.importFromJsonFile = function (event) {
        const fileReader = new FileReader();

        fileReader.onload = function (e) {
            try {
                const importedQuotes = JSON.parse(e.target.result);
                quotes.push(...importedQuotes);
                saveQuotes();
                alert("Quotes imported successfully!");
            } catch {
                alert("Invalid JSON file.");
            }
        };

        fileReader.readAsText(event.target.files[0]);
    };

    // Create Import/Export controls
    function createImportExportControls() {
        const container = document.createElement("div");

        const exportButton = document.createElement("button");
        exportButton.textContent = "Export Quotes";
        exportButton.onclick = exportQuotes;

        const importInput = document.createElement("input");
        importInput.type = "file";
        importInput.accept = ".json";
        importInput.onchange = importFromJsonFile;

        container.appendChild(exportButton);
        container.appendChild(importInput);

        document.body.appendChild(container);
    }

    // Restore last viewed quote from Session Storage
    const lastQuote = sessionStorage.getItem("lastQuote");
    if (lastQuote) {
        const quote = JSON.parse(lastQuote);
        quoteDisplay.innerHTML = `
            <p>"${quote.text}"</p>
            <small>Category: ${quote.category}</small>
        `;
    } else {
        showRandomQuote();
    }

    newQuoteButton.addEventListener("click", showRandomQuote);

    createAddQuoteForm();
    createImportExportControls();
});
