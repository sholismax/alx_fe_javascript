document.addEventListener("DOMContentLoaded", function () {
    // Array of quote objects
    const quotes = [
        { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
        { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
        { text: "Success is not final, failure is not fatal.", category: "Inspiration" }
    ];

    // Select DOM elements
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");

    // Function to display a random quote
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
    }

    // Function to create the Add Quote form dynamically
    function createAddQuoteForm() {
        const formContainer = document.createElement("div");

        const quoteInput = document.createElement("input");
        quoteInput.id = "newQuoteText";
        quoteInput.type = "text";
        quoteInput.placeholder = "Enter a new quote";

        const categoryInput = document.createElement("input");
        categoryInput.id = "newQuoteCategory";
        categoryInput.type = "text";
        categoryInput.placeholder = "Enter quote category";

        const addButton = document.createElement("button");
        addButton.textContent = "Add Quote";

        addButton.onclick = function () {
            addQuote(quoteInput.value, categoryInput.value);
            quoteInput.value = "";
            categoryInput.value = "";
        };

        formContainer.appendChild(quoteInput);
        formContainer.appendChild(categoryInput);
        formContainer.appendChild(addButton);

        document.body.appendChild(formContainer);
    }

    // Function to add a new quote
    function addQuote(text, category) {
        if (text.trim() === "" || category.trim() === "") {
            alert("Please enter both quote and category.");
            return;
        }

        quotes.push({
            text: text.trim(),
            category: category.trim()
        });

        showRandomQuote();
    }

    // Event listener for button
    newQuoteButton.addEventListener("click", showRandomQuote);

    // Initialize app
    createAddQuoteForm();
    showRandomQuote();
});
