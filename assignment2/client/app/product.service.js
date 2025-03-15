/*
 *  Since we are using the regular function keyword, 
 *   we can export our service instance up here.
 */
export default new ProductService({
    host: 'https://inft2202-server.onrender.com/',
    //host: 'http://localhost:3091',
    user: '100934387'
});

/*
 *  Constructor
 */
function ProductService({ host, user }) {
    this.host = host;
    this.headers = new Headers({
        'Content-Type': 'application/json',
        user
    });
}

/*
 * Find a product by name
 */
ProductService.prototype.findProduct = async function(name) {
    const url = new URL(`/api/products/${name}`, this.host);
    const req = new Request(url, {
        headers: this.headers,
        method: 'GET',
    });
    try {
        const res = await fetch(req);
        if (!res.ok) throw new Error(`Failed to fetch product: ${res.statusText}`);
        return res.json();
    } catch (err) {
        throw new Error(`Error finding product: ${err.message}`);
    }
}

/*
 * Get a paginated list of products
 */
ProductService.prototype.getProductPage = async function({ page = 1, perPage = 8 }) {
    const params = new URLSearchParams({ page, perPage });
    const url = new URL(`/api/products?${params.toString()}`, this.host);
    const req = new Request(url, {
        headers: this.headers,
        method: 'GET',
    });
    try {
        const res = await fetch(req);
        if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);
        const data = await res.json();
        return {
            records: data.products, // Ensure the backend returns an array of products
            pagination: {
                page: data.page,
                perPage: data.perPage,
                pages: data.pages
            }
        };
    } catch (err) {
        throw new Error(`Error fetching product page: ${err.message}`);
    }
}

/*
 * Save a new product
 */
ProductService.prototype.saveProduct = async function(product) {
    const url = new URL(`/api/products`, this.host);
    const req = new Request(url, {
        headers: this.headers,
        method: 'POST',
        body: JSON.stringify(product)
    });
    try {
        const res = await fetch(req);
        if (!res.ok) throw new Error(`Failed to save product: ${res.statusText}`);
        return res.json();
    } catch (err) {
        throw new Error(`Error saving product: ${err.message}`);
    }
}

/*
 * Update an existing product
 */
ProductService.prototype.updateProduct = async function(product) {
    const url = new URL(`/api/products`, this.host);
    const req = new Request(url, {
        headers: this.headers,
        method: 'PUT',
        body: JSON.stringify(product)
    });
    try {
        const res = await fetch(req);
        if (!res.ok) throw new Error(`Failed to update product: ${res.statusText}`);
        return res.json();
    } catch (err) {
        throw new Error(`Error updating product: ${err.message}`);
    }
}

/*
 * Delete a product by name
 */
ProductService.prototype.deleteProduct = async function(name) {
    const url = new URL(`/api/products/${name}`, this.host);
    const req = new Request(url, {
        headers: this.headers,
        method: 'DELETE',
    });
    try {
        const res = await fetch(req);
        if (res.status === 204) {
            return true;
        }
        throw new Error(`Failed to delete product: ${res.statusText}`);
    } catch (err) {
        throw new Error(`Error deleting product: ${err.message}`);
    }
}