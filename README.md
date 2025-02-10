## Installation

- `npm install`
- `npm start`

## API Overview

This API provides access to a Pokémon dataset. It includes endpoints for **searching Pokémon by name**, **retrieving Pokémon by ID**, and **paginated Pokémon lists**. Additionally, it supports **chaos parameters** (`delay`, `flakiness`, `chaos`) to introduce artificial latency and errors.

| Endpoint                      | Method | Purpose                                   |
| ----------------------------- | ------ | ----------------------------------------- |
| `/api/pokemon/search/:search` | `GET`  | Search Pokémon by name (with pagination). |
| `/api/pokemon/:id`            | `GET`  | Retrieve Pokémon details by ID.           |
| `/api/pokemon`                | `GET`  | Get a paginated list of Pokémon.          |

## `GET /api/pokemon/search/:search`

Search for Pokémon whose names start with the given query string.

### Query Parameters

| Parameter   | Type            | Description                                                              |
| ----------- | --------------- | ------------------------------------------------------------------------ |
| `page`      | string (Base64) | The **page number** (Base64-encoded). Default is `0`.                    |
| `limit`     | number          | The **number of results per page**. Default is `10`.                     |
| `delay`     | number          | (Optional) Adds an artificial delay in milliseconds.                     |
| `flakiness` | number          | (Optional) Adds randomness where **1 in N** requests fail.               |
| `chaos`     | boolean         | (Optional) If `true`, enables **high flakiness** and a **random delay**. |

### Responses

#### `200 OK`

```json
{
  "pokemon": [
    { "id": 1, "name": "Bulbasaur", "classification": "Seed Pokémon" }
  ],
  "nextPage": "MQ=="
}
```

#### `404 Not Found`

```json
{ "error": "Page out of bounds" }
```

#### `500 Internal Server Error` _(if chaos mode fails a request)_

```json
{ "error": "Something went wrong." }
```

## `GET /api/pokemon/:id`

Retrieve details for a **specific Pokémon** by its unique `id`.

### Path Parameter

| Parameter | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| `id`      | number | The **Pokémon ID** to look up. |

### Query Parameters

| Parameter   | Type    | Description                                                              |
| ----------- | ------- | ------------------------------------------------------------------------ |
| `delay`     | number  | (Optional) Adds an artificial delay in milliseconds.                     |
| `flakiness` | number  | (Optional) Adds randomness where **1 in N** requests fail.               |
| `chaos`     | boolean | (Optional) If `true`, enables **high flakiness** and a **random delay**. |

### Responses

#### `200 OK`

```json
{
  "id": 1,
  "name": "Bulbasaur",
  "classification": "Seed Pokémon",
  "type": ["Grass", "Poison"]
}
```

#### `404 Not Found`

```json
{ "error": "Pokémon not found" }
```

#### `500 Internal Server Error` _(if chaos mode fails a request)_

```json
{ "error": "Something went wrong." }
```

## `GET /api/pokemon`

Fetch a **paginated list of Pokémon**.

### Query Parameters

| Parameter   | Type            | Description                                                              |
| ----------- | --------------- | ------------------------------------------------------------------------ |
| `page`      | string (Base64) | The **page number** (Base64-encoded). Default is `0`.                    |
| `limit`     | number          | The **number of results per page**. Default is `10`.                     |
| `delay`     | number          | (Optional) Adds an artificial delay in milliseconds.                     |
| `flakiness` | number          | (Optional) Adds randomness where **1 in N** requests fail.               |
| `chaos`     | boolean         | (Optional) If `true`, enables **high flakiness** and a **random delay**. |

### Responses

#### `200 OK`

```json
{
  "pokemon": [
    { "id": 1, "name": "Bulbasaur", "classification": "Seed Pokémon" },
    { "id": 2, "name": "Ivysaur", "classification": "Seed Pokémon" }
  ],
  "nextPage": "MQ=="
}
```

#### `400 Bad Request` _(if page encoding is invalid)_

```json
{ "error": "Invalid page encoding" }
```

#### `500 Internal Server Error` _(if chaos mode fails a request)_

```json
{ "error": "Something went wrong." }
```

## Chaos Mode (`withChaos` Middleware)

This middleware introduces **random errors and delays** based on query parameters:

| Parameter   | Effect                                                                              |
| ----------- | ----------------------------------------------------------------------------------- |
| `delay`     | Adds a **response delay** (in milliseconds).                                        |
| `flakiness` | Makes **1 in N** requests fail with `500 Internal Server Error`.                    |
| `chaos`     | If `true`, enables **random delays** and **high flakiness** (5% chance of failure). |
