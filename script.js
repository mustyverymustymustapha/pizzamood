const moodToppings = {
    'happy': ['pineapple', 'bell peppers', 'ham'],
    'sad': ['extra cheese', 'mushrooms', 'olives'],
    'excited': ['pepperoni', 'jalapenos', 'sausage'],
    'tired': ['spinach', 'feta', 'tomatoes'],
    'hungry': ['everything!', 'double cheese', 'extra meat'],
    'relaxed': ['margherita', 'basil', 'mozzarella'],
    'adventurous': ['anchovies', 'arugula', 'prosciutto']
};

let currentTopping = '';

function generateTopping() {
    const moodInput = document.getElementById('moodInput').value.toLowerCase();
    const resultDiv = document.getElementById('result');
    const saveButton = document.getElementById('saveButton');

    if (moodInput.trim() === '') {
        resultDiv.textContent = 'Please enter a mood!';
        saveButton.style.display = 'none';
        return;
    }

    let matchedMood = Object.keys(moodToppings).find(mood => moodInput.includes(mood));

    if (!matchedMood) {
        matchedMood = Object.keys(moodToppings)[Math.floor(Math.random() * Object.keys(moodToppings).length)];
    }

    const toppings = moodToppings[matchedMood];
    currentTopping = toppings[Math.floor(Math.random() * toppings.length)];

    resultDiv.textContent = `Based on your ${matchedMood} mood, we recommend: ${currentTopping}!`;
    saveButton.style.display = 'inline-block';
}

function saveTopping() {
    if (currentTopping) {
        const favoritesList = document.getElementById('favoritesList');
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${currentTopping}</span>
            <div class="star-rating" data-rating="0">
                <span data-value="5">☆</span>
                <span data-value="4">☆</span>
                <span data-value="3">☆</span>
                <span data-value="2">☆</span>
                <span data-value="1">☆</span>
            </div>
            <button class="remove-btn" onclick="removeTopping(this)">Remove</button>
        `;
        favoritesList.appendChild(listItem);
        currentTopping = '';
        document.getElementById('saveButton').style.display = 'none';
        addStarRatingListeners(listItem.querySelector('.star-rating'));
        saveFavoritesToLocalStorage();
    }
}

function removeTopping(button) {
    const listItem = button.parentElement;
    listItem.remove();
    saveFavoritesToLocalStorage();
}

function addStarRatingListeners(starRatingElement) {
    const stars = starRatingElement.querySelectorAll('span');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            starRatingElement.setAttribute('data-rating', value);
            updateStarRating(starRatingElement);
            saveFavoritesToLocalStorage();
        });
    });
}

function updateStarRating(starRatingElement) {
    const stars = starRatingElement.querySelectorAll('span');
    const rating = parseInt(starRatingElement.getAttribute('data-rating'));
    stars.forEach(star => {
        star.classList.remove('active');
        if (star.getAttribute('data-value') <= rating) {
            star.classList.add('active');
        }
    });
}

function loadFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    const favorites = JSON.parse(localStorage.getItem('favoriteToppings')) || [];
    favorites.forEach(favorite => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${favorite.topping}</span>
            <div class="star-rating" data-rating="${favorite.rating}">
                <span data-value="5">☆</span>
                <span data-value="4">☆</span>
                <span data-value="3">☆</span>
                <span data-value="2">☆</span>
                <span data-value="1">☆</span>
            </div>
            <button class="remove-btn" onclick="removeTopping(this)">Remove</button>
        `;
        favoritesList.appendChild(listItem);
        addStarRatingListeners(listItem.querySelector('.star-rating'));
        updateStarRating(listItem.querySelector('.star-rating'));
    });
}

function saveFavoritesToLocalStorage() {
    const favoritesList = document.getElementById('favoritesList');
    const favorites = Array.from(favoritesList.children).map(li => ({
        topping: li.querySelector('span').textContent,
        rating: li.querySelector('.star-rating').getAttribute('data-rating')
    }));
    localStorage.setItem('favoriteToppings', JSON.stringify(favorites));
}

window.addEventListener('load', loadFavorites);
window.addEventListener('beforeunload', saveFavoritesToLocalStorage);