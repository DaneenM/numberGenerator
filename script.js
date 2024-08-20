// Get references to DOM elements
const generateBtn = document.getElementById('generate-numbers');
const numberList = document.getElementById('number-list');
const savedNumbersList = document.getElementById('saved-numbers-list');

// Maximum number of unique 4-digit combinations
const maxUniqueNumbers = 10000;

// Array to store generated numbers and retrieve previously used/saved numbers from localStorage
let numbers = [];
let usedNumbers = JSON.parse(localStorage.getItem('usedNumbers')) || [];
let savedNumbers = JSON.parse(localStorage.getItem('savedNumbers')) || [];

// Function to generate a random 4-digit number
function generateRandomNumber() {
    let number = '';
    for (let i = 0; i < 4; i++) {
        number += Math.floor(Math.random() * 10);
    }
    return number;
}

// Function to generate a list of 10 unique 4-digit numbers
function generateNumbers() {
    // Check if all unique numbers have been used
    if (usedNumbers.length >= maxUniqueNumbers) {
        alert("All possible numbers have been used. Resetting...");
        resetApp();
        return;
    }

    numbers = [];
    while (numbers.length < 10) {
        let newNumber = generateRandomNumber();
        // Ensure the number hasn't been used before
        if (!numbers.includes(newNumber) && !usedNumbers.includes(newNumber)) {
            numbers.push(newNumber);
        }
    }
    renderNumbers();
    generateBtn.disabled = true; // Disable the button after generating numbers
}

// Function to render the list of numbers on the page
function renderNumbers() {
    numberList.innerHTML = '';
    numbers.forEach((number, index) => {
        const li = document.createElement('li');
        li.className = 'number-item';
        li.textContent = number;

        // Create Save Button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.className = 'save-btn';
        saveButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent triggering the useNumber function when saving
            saveNumber(number);
        });

        li.appendChild(saveButton);
        li.addEventListener('click', () => confirmUseNumber(index));
        numberList.appendChild(li);
    });
}

// Function to confirm and remove a number from the list once it's clicked (used)
function confirmUseNumber(index) {
    const confirmed = confirm("Are you sure you want to delete this number?");
    if (confirmed) {
        useNumber(index); // If confirmed, delete the number
    }
}

// Function to remove a number from the list and store it in localStorage
function useNumber(index) {
    const numberToRemove = numbers[index];
    numbers.splice(index, 1); // Remove the clicked number from the list
    usedNumbers.push(numberToRemove); // Add it to the list of used numbers
    localStorage.setItem('usedNumbers', JSON.stringify(usedNumbers)); // Save to localStorage
    renderNumbers(); // Re-render the updated list

    // Re-enable the button if all numbers have been used or deleted
    if (numbers.length === 0) {
        generateBtn.disabled = false;
    }
}

// Function to save a number and store it in localStorage
function saveNumber(number) {
    if (!savedNumbers.includes(number)) {
        savedNumbers.push(number);
        localStorage.setItem('savedNumbers', JSON.stringify(savedNumbers));
        renderSavedNumbers();
    } else {
        alert("Number is already saved.");
    }
}

// Function to render the saved numbers list
function renderSavedNumbers() {
    savedNumbersList.innerHTML = '';
    savedNumbers.forEach(number => {
        const li = document.createElement('li');
        li.className = 'saved-number-item';
        li.textContent = number;
        savedNumbersList.appendChild(li);
    });
}

// Function to reset the app
function resetApp() {
    usedNumbers = [];
    localStorage.removeItem('usedNumbers');
    generateBtn.disabled = false;
    alert("The app has been reset. You can now generate new numbers.");
}

// Initial render of saved numbers
renderSavedNumbers();

// Event listener for generating new numbers
generateBtn.addEventListener('click', () => {
    generateNumbers();
});
