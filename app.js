class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

const bookDetails = document.querySelector("#bookDetails");
const table = document.querySelector("table");
const tableBody = document.querySelector("tbody");
const footer = document.querySelector("footer");
let storedBooks = [];

class UI {
  static storeBook(book) {
    storedBooks.push(book);
    let bookStore = JSON.stringify(storedBooks);
    localStorage.setItem("storedBooks", bookStore);
  }

  static displayBookOnload() {
    const retrievedBooks = JSON.parse(localStorage.getItem("storedBooks"));
    if (!retrievedBooks) return;
    storedBooks = retrievedBooks;

    for (let i = 0; i < storedBooks.length; i++) {
      this.displayBook(storedBooks[i]);
    }
  }

  static displayBook(book) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td> ${book.title} </td>
        <td> ${book.author} </td>
        <td> ${book.isbn} </td>
        <td> <i class="fa-solid fa-circle-minus"></i> </td>
      `;
    tableBody.appendChild(tr);
  }

  static deleteBook(bookIndex) {
    storedBooks.splice(bookIndex, 1);
    let bookStore = JSON.stringify(storedBooks);
    localStorage.setItem("storedBooks", bookStore);
  }
}

window.addEventListener("DOMContentLoaded", UI.displayBookOnload());

function warning(message, location) {
  const div = document.createElement("div");
  div.className = "warning";
  div.innerHTML = `
        <i class="fa-solid fa-circle-exclamation"></i> ${message}
    `;
  location.after(div);
}

bookDetails.addEventListener("submit", (e) => {
  e.preventDefault();
  const titleInput = bookDetails.querySelector("#title");
  const authorInput = bookDetails.querySelector("#author");
  const isbnInput = bookDetails.querySelector("#isbn");
  let title = titleInput.value.toLowerCase();
  let author = authorInput.value.toLowerCase();
  let isbn = parseInt(isbnInput.value);

  resetTableRow();

  // deleting previous validation messages
  const warnings = [...bookDetails.querySelectorAll("div")];
  for (warn of warnings) {
    warn.remove();
  }

  // validation of form input
  if (!author || !title || isNaN(isbn)) {
    if (!author) {
      warning("input the author of the book", authorInput);
    }
    if (!title) {
      warning("input the title of the book", titleInput);
    }
    if (isNaN(isbn)) {
      warning("isbn must be a number", isbnInput);
    }
    return;
  }

  //fill in table
  const book = new Book(title, author, isbn);
  UI.storeBook(book);
  UI.displayBook(book);

  titleInput.value = "";
  authorInput.value = "";
  isbnInput.value = "";
});

tableBody.addEventListener("click", (e) => {
  const trash = [...tableBody.querySelectorAll(".fa-circle-minus")];
  if (e.target.classList.contains("fa-circle-minus")) {
    const index = trash.indexOf(e.target);
    const bookRow = e.target.parentElement.parentElement;
    tableBody.removeChild(bookRow);
    UI.deleteBook(index);
  }
});

const searchBooks = document.querySelector("#searchBook");

function searchBookStore(search) {
  let searchIndex = [];
  for (let i = 0; i < storedBooks.length; i++) {
    for (el in storedBooks[i]) {
      if (String(storedBooks[i][el]).includes(search)) {
        searchIndex.push(i);
      }
    }
  }
  searchIndex = searchIndex.filter(
    (item, index, arr) => arr.indexOf(item) == index
  );
  return searchIndex;
}

function displayResultInfo(arr, search) {
  const resultRow = document.createElement("div");
  resultRow.className = "resultRow";
  resultRow.innerHTML = `
    <p> search input: ${search} </p>
    <p> results: ${arr.length} </p>
    <button class= "cancel" > x </button>
  `;
  table.before(resultRow);
}

function sortResult(arr, tableRows) {
  for (el of tableRows) {
    el.style.display = "none";
  }
  for (let i = 0; i < arr.length; i++) {
    tableRows[arr[i]].style.display = "table-row";
  }
}

function resetTableRow() {
  const tableRows = [...tableBody.querySelectorAll("tr")];
  const resultRow = footer.querySelector(".resultRow");
  if (resultRow) {
    footer.removeChild(resultRow);
  }
  for (el of tableRows) {
    el.style.display = "table-row";
  }
}

searchBooks.addEventListener("submit", (e) => {
  e.preventDefault();
  const tableRows = [...tableBody.querySelectorAll("tr")];
  const searchInput = searchBooks.querySelector("#searchInput");
  const search = searchInput.value.toLowerCase();
  resetTableRow();
  if (!searchInput.value) return;
  let indexArray = searchBookStore(search);
  displayResultInfo(indexArray, search);
  sortResult(indexArray, tableRows);
  searchInput.value = "";
});

footer.addEventListener("click", (e) => {
  if (e.target.classList.contains("cancel")) {
    resetTableRow();
  }
});
