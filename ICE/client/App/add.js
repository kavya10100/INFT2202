// tell us what page we're on
console.log('we are on the add page');

// assign a handler to the submit event
document.getElementById('animal-form')
    .addEventListener('submit', submitAnimalForm);

// create a handler to deal with the submit event
async function submitAnimalForm(event) {
    // prevent the default action from happening
    event.preventDefault();

    const animalForm = event.target;
    const valid = validateAnimalForm(animalForm);

    if (valid) {
        console.log('Form is valid, proceeding...');
        const formData = new FormData(animalForm);
        const animalObject = {};
        formData.forEach((value, key) => {
            animalObject[key] = value;
        });

        const eleNameError = animalForm.name.nextElementSibling;

        try {
            // Save the animal using the service
            await animalService.saveAnimal(animalObject);

            console.log('Animal saved successfully!');
            eleNameError.classList.add('d-none'); // Hide any previous error
            animalForm.reset(); // Clear the form

            // Redirect to the animal list page
            window.location = './list.html';
        } catch (error) {
            console.error('Error saving animal:', error);

            // Check if the error is specifically about the animal already existing
            if (error.message === 'Animal already exists') {
                eleNameError.classList.remove('d-none'); // Show the error
                eleNameError.textContent = "This animal already exists!";
            } else {
                eleNameError.classList.remove('d-none');
                eleNameError.textContent = "An unexpected error occurred. Please try again!";
            }
        }
    } else {
        console.log('Form is not valid, cannot proceed.');
    }
}

// validate the animal form
function validateAnimalForm(form) {
    console.log('Validating form...');
    let valid = true;

    // Validate name
    const name = form.name.value.trim();
    const eleNameError = form.name.nextElementSibling;

    if (name === "") {
        eleNameError.classList.remove('d-none');
        eleNameError.textContent = "You must name this animal!";
        valid = false;
    } else {
        eleNameError.classList.add('d-none');
    }

    // Add more validation for other fields as needed

    return valid;
}

// Mock animalService for saving animals (replace with actual implementation)
const animalService = {
    async saveAnimal(animal) {
        // Simulate a server request
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate a duplicate error
                if (animal.name === 'Duplicate') {
                    reject(new Error('Animal already exists'));
                } else {
                    resolve();
                }
            }, 500);
        });
    }
};
