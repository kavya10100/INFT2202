import productService from "../product.service.js";

function list(recordPage) {
    const container = document.createElement('div');
    container.classList.add('container');

    // Loading spinner
    const divWaiting = document.createElement('div');
    divWaiting.classList.add('text-center');
    divWaiting.innerHTML = '<i class="fa fa-5x fa-spinner fa-spin"></i>';
    container.append(divWaiting);

    // Error/success message container
    const divMessage = document.createElement('div');
    divMessage.classList.add('alert', 'text-center', 'd-none');
    container.append(divMessage);

    // Function to draw pagination
    function drawPagination({ page = 1, perPage = 8, pages = 10 }) {
        function addPage(number, text, style) {
            return `<li class="page-item ${style}">
              <a class="page-link" href="./list.html?page=${number}&perPage=${perPage}">${text}</a>
            </li>`;
        }

        const pagination = document.createElement('div');
        if (pages > 1) {
            pagination.classList.remove('d-none');
        }

        const ul = document.createElement("ul");
        ul.classList.add('pagination');
        ul.insertAdjacentHTML('beforeend', addPage(page - 1, 'Previous', (page == 1) ? 'disabled' : ''));
        for (let i = 1; i <= pages; i++) {
            ul.insertAdjacentHTML('beforeend', addPage(i, i, (i == page) ? 'active' : ''));
        }
        ul.insertAdjacentHTML('beforeend', addPage(page + 1, 'Next', (page == pages) ? 'disabled' : ''));

        pagination.append(ul);
        return pagination;
    }

    // Function to draw the product table
    function drawProductTable(products) {
        // Ensure products is an array
        if (!Array.isArray(products)) {
            console.error("Expected an array of products, but got:", products);
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('alert', 'alert-danger');
            errorMessage.textContent = 'No products found or invalid data format.';
            return errorMessage;
        }

        // If products array is empty, show a message
        if (products.length === 0) {
            const noProductsMessage = document.createElement('div');
            noProductsMessage.classList.add('alert', 'alert-info');
            noProductsMessage.textContent = 'No products found.';
            return noProductsMessage;
        }

        const eleTable = document.createElement('table');
        eleTable.classList.add('table', 'table-striped');

        // Create table header
        const thead = eleTable.createTHead();
        const row = thead.insertRow();
        const headers = ['Name', 'Price', 'Stock', 'Description', 'Actions'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            row.appendChild(th);
        });

        // Create table rows for each product
        for (let product of products) {
            const row = eleTable.insertRow();
            row.insertCell().textContent = product.name;
            row.insertCell().textContent = product.price;
            row.insertCell().textContent = product.stock;
            row.insertCell().textContent = product.desc;

            // Create a cell for action buttons
            const eleBtnCell = row.insertCell();
            eleBtnCell.classList.add('text-center');

            // Delete button
            const eleBtnDelete = document.createElement('button');
            eleBtnDelete.classList.add('btn', 'btn-danger', 'mx-1');
            eleBtnDelete.innerHTML = `<i class="fa fa-trash"></i>`;
            eleBtnDelete.addEventListener('click', onDeleteButtonClick(product));
            eleBtnCell.append(eleBtnDelete);

            // Edit button
            const eleBtnEdit = document.createElement('a');
            eleBtnEdit.classList.add('btn', 'btn-primary', 'mx-1');
            eleBtnEdit.innerHTML = `<i class="fa fa-edit"></i>`;
            eleBtnEdit.href = `./product.html?name=${product.name}`;
            eleBtnCell.append(eleBtnEdit);
        }

        return eleTable;
    }

    // Function to handle delete button click
    function onDeleteButtonClick(product) {
        return event => {
            productService.deleteProduct(product.name)
                .then((success) => {
                    if (success) {
                        window.location.reload();
                    } else {
                        divMessage.innerHTML = 'Failed to delete product.';
                        divMessage.classList.remove('d-none');
                        divMessage.classList.add('alert-danger');
                    }
                })
                .catch(err => {
                    divMessage.innerHTML = 'An error occurred while deleting the product.';
                    divMessage.classList.remove('d-none');
                    divMessage.classList.add('alert-danger');
                });
        };
    }

    // Function to create the content dynamically
    function createContent() {
        productService.getProductPage(recordPage)
            .then((ret) => {
                console.log("API Response:", ret); // Debugging line

                // Ensure ret is defined and has the expected structure
                if (!ret || !ret.data || !Array.isArray(ret.data.products)) {
                    console.error("Invalid API response format:", ret);
                    throw new Error("Invalid API response format");
                }

                let { products, pagination } = ret.data; // Extract products and pagination from the response

                // Hide loading spinner
                divWaiting.classList.add('d-none');

                // Create header with title and pagination
                let header = document.createElement('div');
                header.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-4');
                let h1 = document.createElement('h1');
                h1.innerHTML = 'Product List';
                header.append(h1);
                header.append(drawPagination(pagination));

                // Append header and table to the container
                container.append(header);
                container.append(drawProductTable(products)); // Pass the products array
            })
            .catch(err => {
                console.error("Error fetching products:", err); // Debugging line
                divWaiting.classList.add('d-none');
                divMessage.innerHTML = 'Failed to load products. Please try again later.';
                divMessage.classList.remove('d-none');
                divMessage.classList.add('alert-danger');
            });

        return container;
    }

    return {
        element: createContent()
    };
}

export default list;