const BASE_URL = 'https://thinkful-list-api.herokuapp.com/kevin/bookmarks';

const listApiFetch = function (...args) {
  let error;
  return fetch(...args)
    .then(res => {
      if (!res.ok) {
        error = { code: res.status };

        if (!res.headers.get('content-type').includes('json')) {
          error.message = res.statusText;
          return Promise.reject(error);
        }
      }

      return res.json();
    })
    .then(data => {
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }

      return data;
    });
};


function getBookmarks() {
  const url = `${BASE_URL}`;
  return listApiFetch(url);
}

function createBookmark(newBookmark) {
  const option = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newBookmark),
  };
  const url = `${BASE_URL}`;
  return listApiFetch(url, option);
}

const updateBookmark = function (id, updateData) {
  const newData = JSON.stringify(updateData);
  return listApiFetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: newData
  });
};

const deleteBookmark = function (id) {
  return listApiFetch(BASE_URL + '/' + id, {
    method: 'DELETE'
  });
};

export default {
  getBookmarks,
  deleteBookmark,
  createBookmark,
  updateBookmark,
  listApiFetch,
};