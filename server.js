import express from 'express';
import bodyParser from 'body-parser';
import base64 from 'base-64';
import cors from 'cors';

import pokemon from './pokemon.js';

const app = express();

const pokemonMetadata = pokemon.map(({ name, classification, id }) => ({
  id,
  name,
  classification,
}));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const getPageAndLimit = ({ page = 0, limit = 10 } = {}) => {
  if (typeof page === 'string') {
    page = parseInt(base64.decode(page), 10);
  }
  if (typeof limit === 'string') {
    limit = parseInt(request.query.limit, 10);
  }
  return { page, limit };
};

const withChaos = (request, response, next) => {
  let delay = parseInt(request.query.delay || 0, 10);
  let flakiness = parseInt(request.query.flakiness || 0, 10);
  let chaos = !!request.query.chaos;

  if (chaos) {
    delay = delay || Math.random() * delay + 1000;
    flakiness = flakiness || 5;
  }

  if (flakiness && Date.now() % flakiness === 0) {
    return response.status(500).json({ error: 'Something went wrong.' });
  }

  setTimeout(next, delay);
};

app.get('/api/pokemon/search/:search', withChaos, (request, response) => {
  const search = request.params.search?.toLowerCase() || '';
  const { page, limit } = getPageAndLimit(request.query);

  const matching = pokemonMetadata.filter(({ name }) =>
    name.toLowerCase().startsWith(search),
  );

  if (page < 0 || page >= matching.length) {
    return response.status(404).json({ error: 'Page out of bounds' });
  }

  if (!matching.length) {
    return response.json({ pokemon: [] });
  }

  const selection = matching.slice(page, page + limit);

  const next = page + limit;
  const nextPage = matching[next] ? base64.encode(String(next)) : undefined;

  response.json({
    pokemon: selection,
    nextPage,
  });
});

app.get('/api/pokemon/:id', withChaos, (request, response) => {
  const id = parseInt(request.params.id, 10);
  const foundPokemon = pokemon.find((p) => p.id === id);

  if (!foundPokemon) {
    return response.status(404).json({ error: 'Pokémon not found' });
  }

  response.json(foundPokemon);
});

app.get('/api/pokemon', withChaos, (request, response) => {
  let page = 0;
  try {
    if (request.query.page) {
      page = parseInt(base64.decode(request.query.page), 10);
    }
  } catch {
    return response.status(400).json({ error: 'Invalid page encoding' });
  }

  let limit = parseInt(request.query.limit, 10) || 10;
  let selection = pokemonMetadata.slice(page, page + limit);

  let nextPage = pokemonMetadata[page + limit]
    ? base64.encode(String(page + limit))
    : undefined;

  response.json({
    pokemon: selection,
    nextPage: nextPage ? encodeURIComponent(nextPage) : undefined,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});
