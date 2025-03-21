/*
Name: Cheyenne Norsworthy
Filename: animal.service.js
Course: INFT 2202
Date: March 3, 2025
Description: This is my general js create page.
*/

export default new AnimalService({
    host: 'https://inft2202-server.onrender.com/',
    //host: 'https://localhost:3091',
    user: '100806066'
});

function AnimalService({host, user}) {
    this.host = host;
    this.headers = new Headers({
        'Content-Type': 'application/json',
        user
    });
}

AnimalService.prototype.findAnimal = async function(name) {
    const url = new URL(`/api/animals/${name}`, this.host);
    const req = new Request(url, {
        headers: this.headers,
        method: 'GET',
    });
    try {
        const res = await fetch(req);
        return res.json();
    } catch (err) {
        return false;
    }
}

AnimalService.prototype.getAnimalPage = async function ({ page = 1, perPage = 8}) 
{
    const params = new URLSearchParams({page, perPage});
    const url = new URL(`/api/animals?${params.toString()}`, this.host);
    const req = new Request(url, 
        {
            headers: this.headers,
            method: 'GET',
        });
        try 
        {
            const res = await fetch(req);
            return res.json();
        } catch (err)
        {
            return false;
        }
}

AnimalService.prototype.saveAnimal = async function(animals)
{
    const url = new URL(`/api/animals`, this.host);
    const req = new Request(url, 
        {
            headers: this.headers,
            method: 'POST',
            body: JSON.stringify(animals)
        });
        try
        {
            const res = await fetch(req);
            return res.json();
        } catch (err)
        {
            return false;
        }
}


AnimalService.prototype.updateAnimal = async function(animal)
{
    const url = new URL(`/api/animals`, this.host);
    const req = new Request(url, 
        {
            headers: this.headers,
            method: 'PUT',
            body: JSON.stringify(animal)
        });
        try {
            const res = await fetch(req);
            return res.json();
        } catch (err)
        {
            return false;
        }
}

AnimalService.prototype.deleteAnimal = async function (name)
{
    const url = new URL(`/api/animals/${name}`, this.host);
    const req = new Request(url, 
        {
            headers: this.headers,
            method: 'DELETE',
        });
        try {
            const res = await fetch(req);
            if (res.status === 204) {
                return true;
            }
            return false;
        } catch (err)
        {
            return false;
        }
}