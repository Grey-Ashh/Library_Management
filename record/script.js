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

const borrowedBooks = [];

const bookList = document.getElementById('borrowed-books');
const bookForm = document.getElementById('book-form');
const returnBookSelect = document.getElementById('return-book-select');
const returnBtn = document.getElementById('return-btn');

// Fetch borrowed books from Firebase on page load
database.ref('borrowedBooks').on('value', (snapshot) => {
  borrowedBooks.length = 0; // Clear the current list
  snapshot.forEach((childSnapshot) => {
    borrowedBooks.push(childSnapshot.val());
  });
  updateBookList();
});

bookForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const bookTitle = document.getElementById('book-title').value;
  const borrowerName = document.getElementById('borrower-name').value;
  borrowedBooks.push({ title: bookTitle, borrower: borrowerName });
  updateBookList();

  // Update Firebase with the new borrowed book
  database.ref('borrowedBooks').set(borrowedBooks);
  bookForm.reset();
});

returnBtn.addEventListener('click', () => {
  const selectedIndex = returnBookSelect.selectedIndex;
  if (selectedIndex !== -1) {
    borrowedBooks.splice(selectedIndex, 1);
    updateBookList();

    // Update Firebase to remove the returned book
    database.ref('borrowedBooks').set(borrowedBooks);
  }
});

function updateBookList() {
  bookList.innerHTML = '';
  returnBookSelect.innerHTML = '';
  if (borrowedBooks.length === 0) {
    bookList.textContent = 'No Books Borrowed Yet!';
    returnBookSelect.disabled = true;
    return;
  }
  returnBookSelect.disabled = false;
  borrowedBooks.forEach((bookInfo, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${bookInfo.title} - Borrowed by: ${bookInfo.borrower}`;
    bookList.appendChild(listItem);

    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${bookInfo.title} - Borrowed by: ${bookInfo.borrower}`;
    returnBookSelect.appendChild(option);
  });
}

updateBookList();