const firebaseConfig = {
  apiKey: "AIzaSyAZ_5Nn9R8be8YC1ictWz5MeJHH_9Eygm8",
  authDomain: "librarymanagement-b107f.firebaseapp.com",
  databaseURL: "https://librarymanagement-b107f-default-rtdb.firebaseio.com",
  projectId: "librarymanagement-b107f",
  storageBucket: "librarymanagement-b107f.appspot.com",
  messagingSenderId: "1074768095613",
  appId: "1:1074768095613:web:0726a89d0c156a85bac414"
};
firebase.initializeApp(firebaseConfig);

const database = firebase.database();

const books = [];

const bookList = document.getElementById("book-list");
const addBookBtn = document.getElementById("add-book-btn");
const searchBox = document.getElementById("search-box");

function displayBook(book) {
  const bookItem = document.createElement("div");
  bookItem.classList.add("book-item");
  bookItem.dataset.bookId = book.id;
  bookItem.innerHTML = `<h3>${book.title}</h3><p>by ${book.author}</p>
  <button class="remove-btn" data-book-id="${book.id}">Remove</button>`;
  bookList.appendChild(bookItem);
}

function addBook() {
  const title = prompt("Enter book title:");
  const author = prompt("Enter book author:");
  if (title && author) {
    const newBook = { id: generateBookId(), title, author };
    writeBookData(newBook);
  } else {
    alert("Please enter both title and author.");
  }
}

function generateBookId() {
  return database.ref('books').push().key;
}

function writeBookData(book) {
  const booksRef = database.ref('books');
  booksRef.push(book).then((ref) => {
    console.log("Book added with ID:", ref.key);
  });
}

function removeBook(bookId) {
  console.log("Removing book with ID:", bookId);
  const bookRef = database.ref(`books/${bookId}`);
  const removedBookItem = document.querySelector(`.book-item[data-book-id="${bookId}"]`);

  if (removedBookItem) {
    removedBookItem.parentNode.removeChild(removedBookItem);
  } else {
    console.error("Book element not found on webpage (might be removed already).");
    return;
  }

  bookRef.remove()
    .then(() => {
      console.log("Book removed from database");
      alert("Book removed successfully!");
    })
    .catch(error => {
      console.error("Error removing book from database:", error.message);
      alert("An error occurred. Book not removed.");
      bookList.appendChild(removedBookItem);
    });
}

function readBookData() {
  const booksRef = database.ref('books');
  booksRef.on('value', (snapshot) => {
    const bookData = snapshot.val();
    bookList.innerHTML = "";
    books.length = 0;
    for (const key in bookData) {
      displayBook(bookData[key]);
    }
  });
}

addBookBtn.addEventListener("click", addBook);

bookList.addEventListener("click", function(event) {
  if (event.target.classList.contains("remove-btn")) {
    const bookId = event.target.dataset.bookId;
    console.log("Removing book with ID:", bookId);
    removeBook(bookId);
  }
});

readBookData();
