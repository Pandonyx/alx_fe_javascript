// Array to store quote objects
const quotes = [
    { text: "Life is what happens while you're busy making other plans.", category: "Life" },
    { text: "The only way to do great work is to love what you do.", category: "Work" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
    { text: "Stay hungry, stay foolish.", category: "Motivation" }
];

function loadQuotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
        quotes.push(...JSON.parse(savedQuotes));
    }
}

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    quoteDisplay.innerHTML = `
        <p class="quote-text">${quote.text}</p>
        <p class="quote-category">Category: ${quote.category}</p>
    `;
}

// Add before showRandomQuote function
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

// Function to add a new quote
function addQuote() {
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    const textError = document.getElementById('textError');
    const categoryError = document.getElementById('categoryError');
    
    // Reset error messages
    textError.style.display = 'none';
    categoryError.style.display = 'none';
    
    // Validate inputs
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

    // Create new quote object
    const newQuote = {
        text: textInput.value.trim(),
        category: categoryInput.value.trim()
    };
    
    // Add to quotes array
    quotes.push(newQuote);
    saveQuotes();
    
    // Clear inputs
    textInput.value = '';
    categoryInput.value = '';
    
    // Show the new quote
    showRandomQuote();
    
    // Show success message
    showNotification('Quote added successfully!');
}

// Function to show notification
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
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}


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

// Create toggle button
const toggleButton = document.createElement('button');
toggleButton.id = 'toggleFormButton';
toggleButton.textContent = 'Show Quote Form';
toggleButton.addEventListener('click', createAddQuoteForm);
document.body.insertBefore(toggleButton, document.getElementById('quoteForm'));

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Add event listener for the add quote button
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

// Show initial quote when page loads
showRandomQuote();
loadQuotes();