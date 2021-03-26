const bookTable = document.querySelector('#book_table');;
const searchBar = document.querySelector('.search_bar > input');
const formOpenButton = document.querySelector('#open_pop');
const formPopUp = document.querySelector('.pop');
const formCloseButton = document.querySelector('.pop i');
const addBookButton = document.querySelector('#add_book_button');

const books = JSON.parse(localStorage.getItem('books'));

function displayBooks(books) {
    if (books.length > 0) {
        bookTable.innerHTML = books.map(({title, author, read}, index) =>
            `<div class="book_row">
                <p><b>${title}</b><br>${author}</p>
                <div class="book_control">
                    <label data-bookIndex="${index}">${read ? '' : 'Not '}Read</label>
                    <div class="slider">
                        <input id="read_${index}" type="checkbox"  data-bookIndex="${index}" ${read ? 'checked': ''}>
                        <label for="read_${index}"></label>
                    </div>
                    <i class="ph-trash"  data-bookIndex="${index}"></i>
                </div>
            </div>`
        ).join('');
    } else {
        bookTable.innerHTML = `<h2>No books found :(</h2>`;
    }
}

function sortBooks() {
    books.sort((a, b) => {
        if (a.read === b.read) {
            return a.author > b.author ? 1 : -1;
        } else {
            return a.read ? 1 : -1;
        }
    });
    saveBooks();
}

function saveBooks() {
    localStorage.setItem('books', JSON.stringify(books));
}

function bookTableClickHandler({target}) {
    const {tagName, type, dataset} = target;
    if (tagName === "INPUT" && type === "checkbox") {
        toggleBookRead(+dataset.bookindex);
    } else if (tagName === "I") {
        deleteBook(+dataset.bookindex);
    }
}

function toggleBookRead(index) {
    books[index].read = !books[index].read;
    const readLabel = document.querySelector(`label[data-bookIndex="${index}`);
    readLabel.textContent = `${books[index].read ? '' : 'Not '}Read`;
}

function deleteBook(index) {
    books.splice(index, 1);
    sortBooks()
    displayBooks(books);
}

function searchBarHandler() {
    const search = searchBar.value;
    const foundBooks = books.filter(({author, title}) => author.toLowerCase().includes(search) || title.toLowerCase().includes(search));
    
    displayBooks(foundBooks)
}

function openAddBookForm() {
    formPopUp.style.visibility = 'visible';
}

function closeAddBookForm() {
    formPopUp.style.visibility = 'hidden';
}

function validateAddBookForm() {
    const title = formPopUp.querySelector("#new_book_title").value;
    const author = formPopUp.querySelector("#new_book_author").value;
    const read = formPopUp.querySelector("#new_book_read").checked;
    books.push({ title, author, read });
    formPopUp.querySelector('form').reset();
    sortBooks();
    displayBooks(books);
}


bookTable.addEventListener('click', bookTableClickHandler);
searchBar.addEventListener('keyup', searchBarHandler);
formOpenButton.addEventListener('click', openAddBookForm);
formCloseButton.addEventListener('click', closeAddBookForm);
addBookButton.addEventListener('click', validateAddBookForm);


sortBooks();
displayBooks(books);