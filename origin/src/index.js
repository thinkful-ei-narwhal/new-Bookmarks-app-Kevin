import $ from "jquery";
import api from './api';
import bookmarksApp from "./bookmarksApp"
import store from "./store";

import "./index.css";

const main = function () {
  api.getBookmarks()
    .then((bookmarks) => {
      bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
      bookmarksApp.render();
    });

  bookmarksApp.bindEventListeners();
  bookmarksApp.render();
};

$(main);