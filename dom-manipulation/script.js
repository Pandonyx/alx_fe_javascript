// Store quotes in an array of objects
const quotes = [
    { text: "Life is what happens while you're busy making other plans.", category: "Life" },
    { text: "The only way to do great work is to love what you do.", category: "Work" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
    { text: "Stay hungry, stay foolish.", category: "Motivation" }
];

// Load quotes from localStorage
function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
        quotes.push(...JSON.parse(savedQuotes));
    }
}

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Keep track of last viewed quote in sessionStorage
function saveLastViewedQuote(quote) {
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Pick and display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    quoteDisplay.innerHTML = `
        <p class="quote-text">${quote.text}</p>
        <p class="quote-category">Category: ${quote.category}</p>
    `;
    
    // Update session storage
    saveLastViewedQuote(quote);
}

// Filter quotes by category
function filterByCategory(category) {
    const filteredQuotes = category ? 
        quotes.filter(quote => quote.category.toLowerCase() === category.toLowerCase()) :
        quotes;
    
    if (filteredQuotes.length === 0) {
        showNotification('No quotes found in this category');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `
        <p class="quote-text">${quote.text}</p>
        <p class="quote-category">Category: ${quote.category}</p>
    `;
}

// Get unique categories from quotes
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = new Set(quotes.map(quote => quote.category));
    
    // Clear existing options except "All Categories"
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    // Add category options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.toLowerCase();
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Restore last selected category
    const lastCategory = localStorage.getItem('lastCategory') || 'all';
    categoryFilter.value = lastCategory;
}

// Filter quotes by selected category
function filterQuotes() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter.value;
    
    // Save selected category
    localStorage.setItem('lastCategory', selectedCategory);
    
    if (selectedCategory === 'all') {
        showRandomQuote();
        return;
    }
    
    const filteredQuotes = quotes.filter(quote => 
        quote.category.toLowerCase() === selectedCategory
    );
    
    if (filteredQuotes.length === 0) {
        showNotification('No quotes found in this category');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    displayQuote(filteredQuotes[randomIndex]);
}

// Display a specific quote
function displayQuote(quote) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `
        <p class="quote-text">${quote.text}</p>
        <p class="quote-category">Category: ${quote.category}</p>
    `;
    saveLastViewedQuote(quote);
}

// Handle adding new quotes
function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    const textError = document.getElementById('textError');
    const categoryError = document.getElementById('categoryError');
    
    // Clear previous errors
    textError.style.display = 'none';
    categoryError.style.display = 'none';
    
    // Check inputs
    let isValid = true;
    if (!textInput.value.trim()) {
        textError.style.display = 'block';
        isValid = false;
    }
    if (!categoryInput.value.trim()) {
        categoryError.style.display = 'block';
        isValid = false;
    }
    
    if (!isValid) return;

    // Package the new quote
    const newQuote = {
        text: textInput.value.trim(),
        category: categoryInput.value.trim()
    };
    
    quotes.push(newQuote);
    saveQuotes();
    
    // Update categories dropdown
    populateCategories();
    
    // Reset form
    textInput.value = '';
    categoryInput.value = '';
    
    showRandomQuote();
    showNotification('Quote added successfully!');
}

// Show temporary notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px;
        border-radius: 5px;
        opacity: 1;
        transition: opacity 0.5s;
    `;
    
    document.body.appendChild(notification);
    
    // Cleanup after 3s
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Toggle quote form visibility
function createAddQuoteForm() {
    const quoteForm = document.getElementById('quoteForm');
    const toggleButton = document.getElementById('toggleFormButton');
    
    if (quoteForm.classList.contains('hidden')) {
        quoteForm.classList.remove('hidden');
        toggleButton.textContent = 'Hide Quote Form';
    } else {
        quoteForm.classList.add('hidden');
        toggleButton.textContent = 'Show Quote Form';
    }
}

// Setup form toggle button
const toggleButton = document.createElement('button');
toggleButton.id = 'toggleFormButton';
toggleButton.textContent = 'Show Quote Form';
toggleButton.addEventListener('click', createAddQuoteForm);
document.body.insertBefore(toggleButton, document.getElementById('quoteForm'));

// Hook up event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

// Add event listener for category filter
document.getElementById('categoryFilter').addEventListener('change', filterQuotes);

// Initialize
function initialize() {
    loadQuotes();
    populateCategories();
    filterQuotes(); // This will respect the last selected category
}

initialize();

// Export quotes to JSON file
function exportQuotes() {
    const quotesJson = JSON.stringify(quotes, null, 2);
    const blob = new Blob([quotesJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'quotes.json';
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    
    // Cleanup
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                showNotification('Quotes imported successfully!');
                showRandomQuote();
            } else {
                throw new Error('Invalid format');
            }
        } catch (error) {
            showNotification('Error importing quotes: Invalid JSON format');
        }
    };
    reader.readAsText(file);
}

// Setup import/export handlers
document.getElementById('exportBtn').addEventListener('click', exportQuotes);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);