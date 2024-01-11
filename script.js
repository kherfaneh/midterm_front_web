
window.onload = function () {
    displaySavedData();
};

function submitForm() {
    let nameInput = document.getElementById('name');
    let name = nameInput.value.trim();
    let genderRadio = document.querySelector('input[name="gender"]:checked');

    // Validate name format
    let nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
        document.getElementById('error-message').innerText = 'Invalid name format. Please use only letters and spaces.';
        return;
    }

    // Validate name length
    if (name.length > 255) {
        document.getElementById('error-message').innerText = 'Name exceeds the maximum character limit of 255.';
        return;
    }

    // Clear previous error messages
    document.getElementById('error-message').innerText = '';

    if (name && genderRadio) {
        let gender = genderRadio.value;
        let apiUrl = `https://api.midterm_front_web.io/?name=${encodeURIComponent(name)}`;

        // Fetch data from the server
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch data. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                displaySavedData();
                // Update the prediction box with fetched data
                document.getElementById('prediction').innerText = `Predicted Gender: ${data.gender}`;
                document.getElementById('accuracy').innerText = `Accuracy: ${data.probability * 100}%`;

                // Display saved data after fetching
            })
            .catch(error => {
                // Display fetch error on the page
                document.getElementById('error-message').innerText = `Fetch Error: ${error.message}`;
            });
    } else {
        showToast('Please enter name and select gender before submitting.', type = 'error');
    }
}

function saveResult() {
    let name = document.getElementById('name').value.trim();
    let prediction = document.getElementById('prediction').innerText;
    let accuracy = document.getElementById('accuracy').innerText;

    // Check if the fetched data is empty
    if (prediction === '-') {
        showToast('Cannot save empty prediction. Please submit the form first.', type = 'error');
        return;
    }

    // Validate if there is already a saved entry for the same name
    let existingEntry = localStorage.getItem(name);

    if (existingEntry) {
        // Update the existing entry with the new one
        localStorage.setItem(name, JSON.stringify({ prediction, accuracy }));
    } else {
        // Save the new entry
        localStorage.setItem(name, JSON.stringify({ prediction, accuracy }));
    }

    showToast('Result saved to local storage.', type = 'success');
}


function clearLocalStorage() {
    localStorage.clear();

    // Reset the prediction box
    document.getElementById('prediction').innerText = '-';
    document.getElementById('accuracy').innerText = 'Accuracy: -%';
}

// Function to display saved data on the page
function displaySavedData() {
    let firstKey = localStorage.key(0);
    let savedData = localStorage.getItem(firstKey);

    if (savedData) {
        savedData = JSON.parse(savedData);
        document.getElementById('prediction').innerText = `${savedData.prediction}`;
        document.getElementById('accuracy').innerText = `Accuracy: ${savedData.accuracy}`;
    } else {
        // If there's no saved data, reset the prediction box
        document.getElementById('prediction').innerText = '-';
        document.getElementById('accuracy').innerText = 'Accuracy: -%';
    }
}


function showToast(message, type = 'info') {
    var toastNotification = document.getElementById('toast-notification');
    var toastMessage = document.getElementById('toast-message');

    // Set the toast message
    toastMessage.innerText = message;
    toastNotification.className = `toast ${type}`;
    // Show the toast notification
    toastNotification.classList.remove('hide');
    toastNotification.classList.add('show');

    // Hide the toast after 3 seconds (adjust as needed)
    setTimeout(function () {
        toastNotification.classList.remove('show');
        toastNotification.classList.add('hide');
    }, 3000);
}