import $ from 'jquery';
import store from "./store";
import api from "./api";

const generateError = function (message) {
  return `
      <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `;
};

const renderError = function () {
  if (store.error) {
    const el = generateError(store.error);
    $('.error-container').html(el);
  } else {
    $('.error-container').empty();
  }
};

const handleCloseError = function () {
  $('.error-container').on('click', '#cancel-error', () => {
    store.setError(null);
    renderError();
  });
};

const generateAddingBookmark = function() {
  return `
  <form class = "add-bookmark">
    <label for="bookmark-url">Add New Bookmark:</label>
    <input type="url" class="bookmark-url" id="new-bookmark-url" name="new-bookmark-url" placeholder="http://example.com/" required>
    <input type="text" class="bookmark-title" id="new-bookmark-title" name="new-bookmark-title" placeholder="Add a Title" required>
    <div class="rating">
      <span class="rating-descriptor">Rating:</span>
      <span>
        <input type="radio" name="rating" id="str1" value="1" required>
        <label for="str1">1</label>
      </span>
        <span>
        <input type="radio" name="rating" id="str2" value="2" required>
        <label for="str2">2</label>
      </span>
      <span>
        <input type="radio" name="rating" id="str3" value="3" required>
        <label for="str3">3</label>
      </span>
      <span>
        <input type="radio" name="rating" id="str4" value="4" required>
        <label for="str4">4</label>
      </span>
      <span>
        <input type="radio" name="rating" id="str5" value="5" required>
        <label for="str5">5</label>
      </span>
    </div>
    <input type="text" class="bookmark-desc" id="new-bookmark-desc" name="new-bookmark-desc" placeholder="Add a description" required>
    <button type="button" class="cancel" id="cancel">Cancel</button>
    <input type="submit" class="add-bookmark" id="add-bookmark" value="Save">
  </form>`
}

const generateInteractiveStarRating = function (bookmark) {
  let rating = bookmark.rating;
  let stars = '';
  for (let i=1; i<=5; i++) {
    if (i !== parseInt(rating)) {
      stars +=`
        <span>
          <input type="radio" name="rating" id="str${i}" value="${i}" required>
          <label for="str${i}">${i}</label>
        </span>`
    } else {
        stars +=`
          <span>
          <input class="checked" type="radio" name="rating" id="str${rating}" value="${rating}" checked required>
          <label for="str${rating}">${rating}</label>
        </span>`
      }
    }
  return stars;
}

const generateEditingBookmark = function() {
  let id = store.editing.id;
  return `
    <form class = "editing-bookmark bookmark" data-bookmark-id="${id}">
      <label for="bookmark-url">Edit Bookmark</label>
      <input type="url" class="bookmark-url" id="bookmark-url" name="bookmark-url" value="${store.findById(id).url}" required>
      <input type="text" name="title" class="bookmark-title" id="bookmark-title" value="${store.findById(id).title}" required>
      <div class="rating">
        <span class="rating-descriptor">Rating:</span>
        ${generateInteractiveStarRating(store.findById(id))}
      </div>
        <input type="text" class="bookmark-desc" id="bookmark-desc" name="description" value="${store.findById(id).desc}" required>
      <button type="button" class="cancel" id="cancel">Cancel</button>
      <input type="submit" class="update-bookmark" id="update-bookmark" value="Save">
    </form>`
}

const generateStarRating = function (bookmark) {
  let rating = bookmark.rating;
  let opposite = 5 - bookmark.rating;
  let checkedStars = '';
  let uncheckedStars = '';
  for (let i=1; i<=rating; i++) {
    checkedStars += '<span class="fa fa-star checked"></span>'
  }
  for (let i=1; i<=opposite; i++) {
    uncheckedStars += '<span class="fa fa-star"></span>'
  }
  return checkedStars+uncheckedStars;
}

const generateBookmarkElement = function (bookmark) {
  let id = store.expanded;
  if (id === bookmark.id) {
    return `
      <div class = "bookmark" data-bookmark-id="${store.findById(id).id}">
        <div class="condensed">
          <button type = "button" id='collapse'>-</button>
          <p class = "title">${store.findById(id).title}</p>
          <div class = "display-rating">
            ${generateStarRating(store.findById(id))}
          </div>
        </div>
        <div class = "details">
          <a href="${store.findById(id).url}" target="_blank">Visit Site</a>
          <p>${store.findById(id).desc}</p>
          <button type="button" class="edit">Edit</button>
          <button type="button" class="delete">Delete</button>
        </div>
      </div>`;
  } else {
    return `
      <div class = "bookmark" data-bookmark-id="${bookmark.id}">
        <div class = "condensed">
          <button type = "button" id="expand">+</button>
          <p class = "title">${bookmark.title}</p>
          <div class = "display-rating">
            ${generateStarRating(bookmark)}
          </div>
        </div>
      </div>`
  }
}

const generateAllElements = function (bookmarks) {
  const bookmark = bookmarks.map(bookmark => generateBookmarkElement(bookmark));
  return bookmark.join("");
};

const generateDropdown = function () {
  let filter = store.filter;
  let options = '';
  const selections = [
    { value: 0, selected: 'Show All', },
    { value: 5, selected: '5 Stars', },
    { value: 4, selected: '4+ Stars', },
    { value: 3, selected: '3+ Stars', },
    { value: 2, selected: '2+ Stars', }
  ];

  for (let i=0; i<=selections.length - 1; i++) {
    if (filter != selections[i].value) {
      options += `
      <option value="${selections[i].value}">${selections[i].selected}</option>`
    } else {
      options += `
      <option value="${selections[i].value}" selected>${selections[i].selected}</option>`
    }
  }
  console.log(filter);
  console.log(options);
  return options;
};


const generateMainView = function(bookmarks) {
  return `
  <div class = "initial-view">
    <form class = "initial-options">
      <input id="add-new" type="button" value="New Bookmark">
      <label for="filter"></label>
      <select name="filter" id="filter">
        ${generateDropdown()}
      </select>
    </form>
    ${generateAllElements(bookmarks)}
  </div>`
}

const render = function() {
  renderError();

  let bookmarks = [...store.bookmarks];
  bookmarks = bookmarks.filter(bookmark => bookmark.rating >= store.filter);

  if (store.adding === true) {
    $("main").html(generateAddingBookmark());
  } else if (store.editing.editing === true) {
    $("main").html(generateEditingBookmark());
  } else {
    $("main").html(generateMainView(bookmarks));
  }
} 

const getBookmarkIdFromElement = function (bookmark) {
  return $(bookmark)
    .closest(".bookmark")
    .data("bookmark-id");
};

const handleAddBookmarkButton = function() {
  $('body').on('click', '#add-new', event => {
    event.preventDefault();
    store.adding = true;
    render();
  })
}

const handleFilter = function() {
  $("body").on("change", "#filter", event => {
    event.preventDefault();
    store.filter = $("#filter").val();
    render();
  });
}

const handleCollapseButton = function() {
  $("body").on('click', '#collapse', event => {
    event.preventDefault();
    store.expanded = '';
    render();
  });
}

const handleExpandButton = function() {
  $("body").on('click', '#expand', event => {
    event.preventDefault();
    store.expanded = getBookmarkIdFromElement(event.currentTarget);
    render();
  });
}

const handleEditButton = function() {
  $("body").on('click', '.edit', event => {
    event.preventDefault();
    store.editing.id = getBookmarkIdFromElement(event.currentTarget);
    store.editing.editing = true;
    render();
  })
}

const handleDeleteButton = function() {
  $("body").on('click', '.delete', event => {
    event.preventDefault();
    const id = getBookmarkIdFromElement(event.currentTarget);
    api.deleteBookmark(id)
      .then(() => {
        store.findAndDelete(id);
        render();
      })
      .catch((error) => {
        console.log(error);
        store.setError(error.message);
        renderError();
      });
  })
}

const handleNewBookmarkSubmit = function() {
  $('body').on('submit', '.add-bookmark', event => {
    event.preventDefault();
    const newBookmark = {};
    newBookmark.title = $(".bookmark-title").val();
    newBookmark.url = $(".bookmark-url").val();
    newBookmark.desc = $(".bookmark-desc").val();
    newBookmark.rating = $('input[name="rating"]:checked').val();
    api.createBookmark(newBookmark)
      .then((newBookmark) => {
        store.addBookmark(newBookmark);
        store.adding = false;
        render();
      })
      .catch((error) => {
        console.log(error);
        store.setError(error.message);
        renderError();
      });
  });
};

const handleUpdateBookmarkSubmit = function() {
  $('body').on('submit', '.editing-bookmark', event => {
    event.preventDefault();
    const id = getBookmarkIdFromElement(event.currentTarget);
    const editedBookmark = {};
    editedBookmark.title = $(".bookmark-title").val();
    editedBookmark.url = $(".bookmark-url").val();
    editedBookmark.desc = $(".bookmark-desc").val();
    editedBookmark.rating = $('input[name="rating"]:checked').val();

    api.updateBookmark(id, editedBookmark)
      .then(() => {
        store.findAndUpdate(id, editedBookmark);
        store.editing.editing = false;

        render();
      })
      .catch((error) => {
        console.log(error);
        store.setError(error.message);
        renderError();
      });
  });
}

const handleCancelButton = function() {
  $('body').on('click', '#cancel', event => {
    event.preventDefault();
    store.adding = false;
    store.editing.editing = false;
    store.editing.id = '';
    render();
  });
}


const bindEventListeners = function() {
  handleAddBookmarkButton();
  handleFilter();
  handleExpandButton();
  handleCollapseButton();
  handleEditButton();
  handleDeleteButton();
  handleNewBookmarkSubmit();
  handleUpdateBookmarkSubmit();
  handleCancelButton();
  handleCloseError();
}

export default {
  render,
  bindEventListeners,
}