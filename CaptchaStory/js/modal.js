let captchaTimeout;


function showCaptchaPopup() {
    const modal = document.getElementById("captchaModal");
    const captchaContent = document.getElementById("captcha-content");

    // Load random CAPTCHA
    loadRandomCaptcha(captchaContent);

    modal.style.display = "block"; // Show the modal

    // Start a 10-second timeout for CAPTCHA
    captchaTimeout = setTimeout(() => {
        Swal.fire({
            title: "CAPTCHA Failed",
            text: "Time limit exceeded. Please try logging in again.",
            icon: "error",
            confirmButtonText: "OK"
        }).then(() => {
            modal.style.display = "none"; // Close the modal
            resetLogin(); // Reset login form and error message
        });
    }, 10000); // 10 seconds

    // Close the modal when user clicks on <span> (x)
    document.getElementById("closeModal").onclick = function() {
        modal.style.display = "none";
        clearTimeout(captchaTimeout); // Clear timeout if user closes manually
    };

    // Close the modal if user clicks outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            clearTimeout(captchaTimeout); // Clear timeout if user clicks outside
        }
    };
}

function startCaptchaTimeout() {
    clearTimeout(captchaTimeout); // Clear any existing timeout
    captchaTimeout = setTimeout(() => {
        Swal.fire({
            title: "CAPTCHA Failed",
            text: "Time limit exceeded. Please try logging in again.",
            icon: "error",
            confirmButtonText: "OK"
        }).then(() => {
            document.getElementById("captchaModal").style.display = "none"; // Close the modal
            resetLogin(); // Reset login form and error message
        });
    }, 10000); // 10 seconds
}

// Function to mark CAPTCHA as completed and hide the modal
function completeCaptcha() {
    clearTimeout(captchaTimeout); // Clear timeout when CAPTCHA is completed
    const modal = document.getElementById("captchaModal");
    modal.style.display = "none"; // Close CAPTCHA modal immediately

    captchaCompleted = true; // Mark CAPTCHA as completed
    captchaRequired = false;  // Reset CAPTCHA requirement after completion

    if (failedLoginAttempts >= 5) {
        // Jika pengguna gagal 5 kali, beri pesan dan reset form
        Swal.fire({
            title: "CAPTCHA Completed",
            text: "Please enter your username and password again to proceed.",
            icon: "info",
            confirmButtonText: "OK"
        }).then(() => {
            resetLogin(); // Reset form to allow user to re-enter login details
            failedLoginAttempts = 0; // Reset failed attempts counter
        });
    } else {
        // Jika login benar dan CAPTCHA selesai, arahkan ke home page
        window.location.href = '../html/home.html';
    }
}


// Function to reload the CAPTCHA after incorrect answer
function reloadCaptcha() {
    const captchaContent = document.getElementById("captcha-content");
    captchaContent.innerHTML = ''; // Clear existing CAPTCHA content
    loadRandomCaptcha(captchaContent); // Load new random CAPTCHA
}

function loadRandomCaptcha(captchaContent) {
    const captchaPages = ['page1.html', 'page2.html', 'page3.html'];
    const randomIndex = Math.floor(Math.random() * captchaPages.length);
    const randomPage = `${captchaPages[randomIndex]}?t=${Date.now()}`;

    fetch(randomPage)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            captchaContent.innerHTML = html;

            // Set data-type based on the loaded page
            if (randomPage.includes('page1.html')) {
                captchaContent.setAttribute('data-type', 'house');
            } else if (randomPage.includes('page2.html')) {
                captchaContent.setAttribute('data-type', 'fruit');
            } else if (randomPage.includes('page3.html')) {
                captchaContent.setAttribute('data-type', 'animal');
            }

            // Acak posisi gambar setelah CAPTCHA dimuat
            shuffleCaptchaImages(captchaContent);

            // Initialize the CAPTCHA event listeners
            initializeCaptcha(captchaContent.getAttribute('data-type'));
        })
        .catch(error => {
            console.error('Error loading CAPTCHA:', error);
            Swal.fire({
                title: "Error loading CAPTCHA",
                text: "Please try again later.",
                icon: "error",
                confirmButtonText: "OK"
            });
        });
}

function shuffleCaptchaImages(captchaContent) {
    const images = Array.from(captchaContent.querySelectorAll('img'));

    // Tentukan jumlah pengacakan ulang (misalnya, 3 kali)
    const shuffleTimes = 3;
    for (let n = 0; n < shuffleTimes; n++) {
        for (let i = images.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [images[i], images[j]] = [images[j], images[i]];
        }
    }

    // Tambahkan kembali elemen gambar yang telah diacak ke captchaContent
    images.forEach(image => captchaContent.appendChild(image));
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
            imageUrl: "../style/carrot.jpg",
            imageWidth: 200,
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
            imageUrl: "../style/apple.jpg",
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: "Custom image",
            confirmButtonText: 'OK'
        }).then(() => {
            reloadCaptcha()
            startCaptchaTimeout()
        });
    });

    // Event listener for banana (incorrect answer)
    bananaImage.addEventListener('click', function() {
        Swal.fire({
            title: "Jawaban Masih belum tepat!",
            text: "Ini buah pisang, buah ini dapat membantu menjaga kekebalan tubuh!",
            imageUrl: "../style/banana.jpg",
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: "Custom image",
            confirmButtonText: 'OK'
        }).then(() => {
            reloadCaptcha()
            startCaptchaTimeout()
        });
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
        imageUrl: "../style/rumahkelinci.png",
        imageWidth: 200,
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
        }).then(() => {
            reloadCaptcha()
            startCaptchaTimeout()
        });
    });

    // Event listener for cat house (incorrect answer)
    catHouseImage.addEventListener('click', function() {
        Swal.fire({
            title: "Jawaban Masih belum tepat!",
            text: "Ini rumah kucing!",
            imageUrl: "../style/catHouse.png",
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: "Custom image",
            confirmButtonText: 'OK'
        }).then(() => {
            reloadCaptcha()
            startCaptchaTimeout()
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
            imageUrl: "../style/turtle.JPG",
            imageWidth: 200,
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
            imageUrl: "../style/Fish.jpg",
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: "Fish image",
            confirmButtonText: 'OK'
        }).then(() => {
            reloadCaptcha()
            startCaptchaTimeout()
        });
    });

    // Event listener for bird (incorrect answer)
    birdImage.addEventListener('click', function() {
        Swal.fire({
            title: "Oops, Salah!",
            text: "Burung lebih suka terbang daripada berlari!",
            imageUrl: "../style/bird.jpg",
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: "Bird image",
            confirmButtonText: 'OK'
        }).then(() => {
            reloadCaptcha()
            startCaptchaTimeout()
        });
    });
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
