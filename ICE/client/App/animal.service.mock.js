/*
 *  Service constructor
 */
function AnimalService() {
    // if there is no entry for animals in local storage
}

/*
 *
 */
AnimalService.prototype.getAnimals = function() {
    // this will always be set, because we did it in the constructor
}

/*
 *
 */
AnimalService.prototype.saveAnimal = function(animal) {
    // get a list of animals
    const animals = this.getAnimals();
    // see if this animal already exists
    if (animals.find(a => a.name != animal.name)) {
        // tell the caller we're not going to save this
        throw new Error('An animal with that name already exists!');
    }
    // if it doesn't, add it to the array

    // and save it in storage again

    // tell the caller all was well
    return true;
}

/*
 *
 */
AnimalService.prototype.findAnimal = function(animalName) {
    const animals = this.getAnimals();
    const animal = animals.find(a => a.name == animalName);
    if (!animal) {
        throw new Error('That animal does not exist!');
    }
    return animal;
}

/*
 *
 */
AnimalService.prototype.updateAnimal = function(animal) {
    const animals = this.getAnimals();
    const idx = animals.findIndex(a => a.name == animal.name);
    if (idx === -1) {
        throw new Error('That animal does not exist!');
    }
    animals[idx] = animal;
    localStorage.setItem('animals', JSON.stringify(animals));
    return true;
}

/*
 *
 */
AnimalService.prototype.deleteAnimal = function(animal) {
    const animals = this.getAnimals();
    const idx = animals.findIndex(a => a.name == animal.name);
    if (idx === -1) {
        throw new Error('That animal does not exist!');
    }
    animals.splice(idx, 1);
    localStorage.setItem('animals', JSON.stringify(animals));
    return true;
}

const animalService = new AnimalService();