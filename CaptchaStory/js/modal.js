function showCaptchaPopup() {
    const modal = document.getElementById("captchaModal");
    const captchaContent = document.getElementById("captcha-content");

    // Load random CAPTCHA
    loadRandomCaptcha(captchaContent);

    modal.style.display = "block"; // Show the modal

    // Close the modal when user clicks on <span> (x)
    document.getElementById("closeModal").onclick = function() {
        modal.style.display = "none";
    };

    // Close the modal if user clicks outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}


function loadRandomCaptcha(captchaContent) {
    const captchaPages = ['page1.html', 'page2.html', 'page3.html'];
    const randomPage = captchaPages[Math.floor(Math.random() * captchaPages.length)];

    console.log('Loading CAPTCHA page:', randomPage); // Log halaman yang dipilih
    console.log('Fetching:', randomPage); // Log URL yang akan di-fetch

    fetch(randomPage)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            captchaContent.innerHTML = html; // Set konten CAPTCHA

            // Atur data-type berdasarkan halaman yang dimuat
            if (randomPage === 'page1.html') {
                captchaContent.setAttribute('data-type', 'house'); // Untuk rumah
            } else if (randomPage === 'page2.html') {
                captchaContent.setAttribute('data-type', 'fruit'); // Untuk buah
            } else if (randomPage === 'page3.html') {
                captchaContent.setAttribute('data-type', 'animal'); // Untuk hewan
            }

            // Langsung inisialisasi setelah mengatur innerHTML
            const captchaContentElement = document.getElementById('captcha-content');
            if (captchaContentElement) {
                const captchaType = captchaContentElement.getAttribute('data-type');
                console.log('CAPTCHA Type:', captchaType); // Log tipe CAPTCHA
                initializeCaptcha(captchaType);
            } else {
                console.error('CAPTCHA content element not found.');
            }
        })
        .catch(error => {
            console.error('Error loading CAPTCHA:', error);
        });
}


// Initialize CAPTCHA event listeners based on type
function initializeCaptcha(captchaType) {
    console.log('Initializing CAPTCHA of type:', captchaType);
    if (captchaType === 'fruit') {
        initializeFruitCaptcha(); // Initialize fruit-related event listeners
    } else if (captchaType === 'house') {
        initializeHouseCaptcha(); // Initialize house-related event listeners
    } else if (captchaType === 'animal') {
        initializeAnimalCaptcha(); // Initialize animal-related event listeners
    } else {
        console.error('Unknown CAPTCHA type:', captchaType);
    }
}

// Event listeners for fruit CAPTCHA
function initializeFruitCaptcha() {
    const carrotImage = document.getElementById('carrot');
    const appleImage = document.getElementById('apple');
    const bananaImage = document.getElementById('banana');

    if (!carrotImage || !appleImage || !bananaImage) {
        console.error('CAPTCHA images not found. Make sure the fruit images are loaded correctly.');
        return;
    }

    // Event listener for carrot (correct answer)
    carrotImage.addEventListener('click', function() {
        Swal.fire({
            title: "Nice Job!",
            text: "Tahukan kamu, Wortel itu baik untuk Mata!",
            imageUrl: "../style/Wortel.png",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Custom image",
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                completeCaptcha();
            }
        });
    });

    // Event listener for apple (incorrect answer)
    appleImage.addEventListener('click', function() {
        Swal.fire({
            title: "Jawaban Masih belum tepat!",
            text: "Ini buah apel, sehat untuk pencernaan!",
            imageUrl: "../style/apple2.png",
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: "Custom image",
            confirmButtonText: 'OK'
        }).then(() => reloadCaptcha());
    });

    // Event listener for banana (incorrect answer)
    bananaImage.addEventListener('click', function() {
        Swal.fire({
            title: "Jawaban Masih belum tepat!",
            text: "Ini buah pisang, buah ini dapat membantu menjaga kekebalan tubuh!",
            imageUrl: "../style/banana2.png",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Custom image",
            confirmButtonText: 'OK'
        }).then(() => reloadCaptcha());
    });
}

// Event listeners for house CAPTCHA
function initializeHouseCaptcha() {
    const rabbitHouseImage = document.getElementById('rabbitHouse');
    const dogHouseImage = document.getElementById('dogHouse');
    const catHouseImage = document.getElementById('catHouse');

    if (!rabbitHouseImage || !dogHouseImage || !catHouseImage) {
        console.error('CAPTCHA images not found. Make sure the house images are loaded correctly.');
        return;
    }

    // Event listener for rabbit house (correct answer)
// Event listener for rabbit house (correct answer)
rabbitHouseImage.addEventListener('click', function() {
    Swal.fire({
        title: "Nice Job!",
        text: "Rumah kelinci umumnya berada di bawah tanah!",
        imageUrl: "../style/rumahKelinci.png",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "Custom image",
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            completeCaptcha(); // Ini akan menutup modal dan mengarahkan ke home.html
        }
    });
});


    // Event listener for dog house (incorrect answer)
    dogHouseImage.addEventListener('click', function() {
        Swal.fire({
            title: "Jawaban Masih belum tepat!",
            text: "Ini rumah anjing!",
            imageUrl: "../style/dogHouse.png",
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: "Custom image",
            confirmButtonText: 'OK'
        });
    });

    // Event listener for cat house (incorrect answer)
    catHouseImage.addEventListener('click', function() {
        Swal.fire({
            title: "Jawaban Masih belum tepat!",
            text: "Ini rumah kucing!",
            imageUrl: "../style/catHouse.png",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Custom image",
            confirmButtonText: 'OK'
        });
    });
}


function initializeAnimalCaptcha() {
    const fishImage = document.getElementById('fish');
    const birdImage = document.getElementById('bird');
    const turtleImage = document.getElementById('turtle');

    if (!fishImage || !birdImage || !turtleImage) {
        console.error('CAPTCHA images not found. Make sure the animal images are loaded correctly.');
        return;
    }

    // Event listener for turtle (correct answer)
    turtleImage.addEventListener('click', function() {
        Swal.fire({
            title: "Good Job!",
            text: "Turtle bisa berlari bersama kelinci, meskipun lambat!",
            imageUrl: "../style/turtle.png",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Turtle image",
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                completeCaptcha();
            }
        });
    });

    // Event listener for fish (incorrect answer)
    fishImage.addEventListener('click', function() {
        Swal.fire({
            title: "Oops, Salah!",
            text: "Ikan tidak bisa berlari di darat!",
            imageUrl: "../style/Fish.png",
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: "Fish image",
            confirmButtonText: 'OK'
        }).then(() => reloadCaptcha());
    });

    // Event listener for bird (incorrect answer)
    birdImage.addEventListener('click', function() {
        Swal.fire({
            title: "Oops, Salah!",
            text: "Burung lebih suka terbang daripada berlari!",
            imageUrl: "../style/bird.png",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Bird image",
            confirmButtonText: 'OK'
        }).then(() => reloadCaptcha());
    });
}

// Function to mark CAPTCHA as completed and hide the modal
function completeCaptcha() {
    captchaCompleted = true; 
    captchaRequired = false; 
    const modal = document.getElementById("captchaModal");
    modal.style.display = "none";
    
    // Arahkan ke home.html setelah CAPTCHA selesai
    window.location.href = 'home.html'; // Ganti dengan path yang sesuai
}


// Function to reload the CAPTCHA after incorrect answer
function reloadCaptcha() {
    loadRandomCaptcha(document.getElementById("captcha-content"));
}

// Reset login form and error message
function resetLogin() {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('error-message').textContent = '';
    
    // Reset CAPTCHA requirement
    if (captchaRequired) {
        showCaptchaPopup(); // Show CAPTCHA again for the user to try again
    } else {
        captchaCompleted = false; // Reset CAPTCHA completion status
    }
}
