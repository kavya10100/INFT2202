// tell us what page we're on
console.log('we are on the add page');

// assign a handler to the submit event
document.getElementById('animal-form')
    .addEventListener('submit', submitAnimalForm);

// create a handler to deal with the submit event
async function submitAnimalForm(event) {
    // prevent the default action from happening
    event.preventDefault();

    // get a reference to the form (from the event)
    const animalForm = event.target;

    // validate the form
    const valid = validateAnimalForm(animalForm);

    // do stuff if the form is valid
    if (valid) {
        console.log('we are good');

        const formData = new FormData(animalForm);
        const animalObject = {};
        formData.forEach((value, key) => {
            animalObject[key] = value;
        });

        const eleNameError = animalForm.name.nextElementSibling;
        try {
            await animalService.saveAnimal(animalObject);
            eleNameError.classList.add('d-none');

            // Reset the form
            animalForm.reset();

            // Redirect to list.html with a success message in the query parameters
            window.location = './list.html?status=success';
        } catch (error) {
            console.log(error);
            eleNameError.classList.remove('d-none');
            eleNameError.textContent = "This animal already exists!";
        }
    } else {
        console.log('we are not good');
    }
}

// validate the animal form
function validateAnimalForm(form) {
    console.log('validating');
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

    // Validate breed
    const breed = form.breed.value.trim();
    const eleBreedError = form.breed.nextElementSibling;
    if (breed === "") {
        eleBreedError.classList.remove('d-none');
        eleBreedError.textContent = "You must specify the animal breed!";
        valid = false;
    } else {
        eleBreedError.classList.add('d-none');
    }

    // Validate number of legs
    const legs = form.legs.value;
    const eleLegsError = form.legs.nextElementSibling;
    if (legs === "" || legs < 0) {
        eleLegsError.classList.remove('d-none');
        eleLegsError.textContent = "You must specify a valid number of legs!";
        valid = false;
    } else {
        eleLegsError.classList.add('d-none');
    }

    // Validate number of eyes
    const eyes = form.eyes.value;
    const eleEyesError = form.eyes.nextElementSibling;
    if (eyes === "" || eyes < 0) {
        eleEyesError.classList.remove('d-none');
        eleEyesError.textContent = "You must specify a valid number of eyes!";
        valid = false;
    } else {
        eleEyesError.classList.add('d-none');
    }

    // Validate sound
    const sound = form.sound.value.trim();
    const eleSoundError = form.sound.nextElementSibling;
    if (sound === "") {
        eleSoundError.classList.remove('d-none');
        eleSoundError.textContent = "You must specify the sound this animal makes!";
        valid = false;
    } else {
        eleSoundError.classList.add('d-none');
    }

    // Return if the form is valid or not
    return valid;
}

// Code for list.html to display success message
if (window.location.search.includes('status=success')) {
    alert('Animal saved successfully!');
}
