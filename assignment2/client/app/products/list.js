import productService from "../product.service.js";

function list(recordPage) {
    const container = document.createElement('div');
    container.classList.add('container');

    // Loading spinner
    const divWaiting = document.createElement('div');
    divWaiting.classList.add('text-center');
    divWaiting.innerHTML = '<i class="fa fa-5x fa-spinner fa-spin"></i>';
    container.append(divWaiting);

    // Error message container
    const divMessage = document.createElement('div');
    divMessage.classList.add('alert', 'text-center', 'd-none');
    container.append(divMessage);

    // Pagination
    function drawPagination({ page = 1, perPage = 5, pages = 10 }) {
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

    // Product table
    function drawProductTable(products) {
        if (!Array.isArray(products)) {
            console.error('Expected an array of products, but got:', products);
            return document.createElement('div'); // Return an empty div as a fallback
        }

        const eleTable = document.createElement('table');
        eleTable.classList.add('table', 'table-striped');

        // Table header
        const thead = eleTable.createTHead();
        const row = thead.insertRow();
        const headers = ['Name', 'Price', 'Description', 'Stock', 'Actions'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            row.appendChild(th);
        });

        // Table rows
        for (let product of products) {
            const row = eleTable.insertRow();
            row.insertCell().textContent = product.name;
            row.insertCell().textContent = `$${product.price}`;
            row.insertCell().textContent = product.description;
            row.insertCell().textContent = product.stock;

            // Action buttons
            const eleBtnCell = row.insertCell();
            eleBtnCell.classList.add();

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
            eleBtnEdit.href = `./product.html?id=${product.id}`;
            eleBtnCell.append(eleBtnEdit);
        }

        return eleTable;
    }

    // Delete button handler
    function onDeleteButtonClick(product) {
        return event => {
            productService.deleteProduct(product.id).then(() => { window.location.reload(); });
        };
    }

    // Create content
    function createContent() {
        productService.getProductPage(recordPage)
            .then((ret) => {
                console.log('Data returned from productService.getProductPage:', ret); // Debugging
                if (!ret || !Array.isArray(ret.records)) {
                    throw new Error('Invalid data format: records is not an array');
                }

                let { records, pagination } = ret;
                divWaiting.classList.add('d-none');

                // Header with title and pagination
                let header = document.createElement('div');
                header.classList.add('d-flex', 'justify-content-between');
                let h1 = document.createElement('h1');
                h1.innerHTML = 'Product List';
                header.append(h1);
                header.append(drawPagination(pagination));

                // Append header and table to container
                container.append(header);
                container.append(drawProductTable(records));
            })
            .catch(err => {
                console.error('Error in createContent:', err); // Debugging
                divWaiting.classList.add('d-none');
                divMessage.innerHTML = err.message || 'An error occurred';
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