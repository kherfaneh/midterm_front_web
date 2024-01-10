
window.onload = function () {
    displaySavedData();
};

function submitForm() {
    let nameInput = document.getElementById('name');
    let name = nameInput.value.trim();
    let genderRadio = document.querySelector('input[name="gender"]:checked');

    let nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(name)) {
        document.getElementById('error-message').innerText = 'Invalid name format. Please use only letters and spaces.';
        return;
    }

    if (name.length > 255) {
        document.getElementById('error-message').innerText = 'Name exceeds the maximum character limit of 255.';
        return;
    }

    document.getElementById('error-message').innerText = '';

    if (name && genderRadio) {
        let gender = genderRadio.value;
        let apiUrl = `https://api.genderize.io/?name=${encodeURIComponent(name)}`;
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch data. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                displaySavedData();
                document.getElementById('prediction').innerText = `Predicted Gender: ${data.gender}`;
                document.getElementById('accuracy').innerText = `Accuracy: ${data.probability * 100}%`;
            })
            .catch(error => {
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
    if (prediction === '-') {
        showToast('Cannot save empty prediction. Please submit the form first.', type = 'error');
        return;
    }
    showToast('Result saved to local storage.', type = 'success');
    if (existingEntry) {
        localStorage.setItem(name, JSON.stringify({ prediction, accuracy }));
    }
}

function clearLocalStorage() {
    localStorage.clear();

    // Reset the prediction box
    document.getElementById('prediction').innerText = '-';
    document.getElementById('accuracy').innerText = 'Accuracy: -%';
}

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
    toastMessage.innerText = message;
    toastNotification.className = `toast ${type}`;
    toastNotification.classList.remove('hide');
    toastNotification.classList.add('show');
}

