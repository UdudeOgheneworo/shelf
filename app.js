class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
const tableBody = document.querySelector(".tableBody");
let storeBook = [];

class UI {
  static saveBook(book) {
    storeBook.push(book);
    const save = JSON.stringify(storeBook);
    localStorage.setItem("storeBook", save);
  }
  static displayBookOnload() {
    storeBook = JSON.parse(localStorage.getItem("storeBook"));
    for (let i = 0; i < storeBook.length; i++) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${storeBook[i].title}</td>
        <td>${storeBook[i].author}</td>
        <td class = "isbn">${storeBook[i].isbn}</td>
        <td><i class="fa-solid fa-trash"></i></td>
      `;
      tableBody.appendChild(row);
    }
  }
  static displayBook(book) {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td class = "isbn">${book.isbn}</td>
    <td><i class="fa-solid fa-trash"></i></td>
    `;
    tableBody.appendChild(row);
  }
  static deleteBook(target, index) {
    tableBody.removeChild(target);
    storeBook = JSON.parse(localStorage.getItem("storeBook"));
    storeBook.splice(index, 1);
    const save = JSON.stringify(storeBook);
    localStorage.setItem("storeBook", save);
  }
}

window.addEventListener("DOMcontentLoaded", UI.displayBookOnload());

const submit = document.querySelector(".submit");
const form = document.querySelector(".form");

const titleInput = form.querySelector("#title");
const authorInput = form.querySelector("#author");
const isbnInput = form.querySelector("#isbn");
let trash;

function notification() {
  const notify = document.querySelector(".notification");
  const p = document.createElement("h4");
  p.innerText =
    "title and author name has to be filled and isbn should be a number";
  notify.append(p);
  setTimeout(() => {
    notify.removeChild(document.querySelector("h4"));
  }, 1000);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!titleInput.value || !authorInput.value || !isbnInput.value) {
    notification();
    return;
  }
  title = titleInput.value;
  author = authorInput.value;
  isbn = isbnInput.value;
  const book = new Book(title, author, isbn);
  UI.saveBook(book);
  UI.displayBook(book);
  titleInput.value = "";
  authorInput.value = "";
  isbnInput.value = "";
});

tableBody.addEventListener("click", (e) => {
  if (!e.target.classList.contains("fa-trash")) return;
  const tableBodyRows = [...tableBody.querySelectorAll("tr")];
  const target = e.target.parentElement.parentElement;
  const index = tableBodyRows.indexOf(target);
  UI.deleteBook(target, index);
});
