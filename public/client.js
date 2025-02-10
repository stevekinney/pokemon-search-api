const searchQuery = document.getElementById('search-query');
const searchResults = document.getElementById('search-results');

searchQuery.addEventListener('keyup', (event) => {
  const query = event.target.value;
  fetch(`/api/pokemon/search/${query}`)
    .then((response) => response && response.json())
    .then(({ pokemon }) => {
      clearChildren(searchResults);
      if (!pokemon) return;

      const list = document.createElement('ul');

      for (const character of pokemon) {
        list.appendChild(createListItem(getName(character)));
      }

      searchResults.appendChild(list);
    })
    .catch((error) => console.error(error));
});

const getName = (character) => character.name;

const createNode = (elementType) => (textContent) => {
  const node = document.createElement(elementType);
  node.textContent = textContent;
  return node;
};

const createListItem = createNode('li');
const clearChildren = (node) => {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
};
