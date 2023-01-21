# Poké Test

## Getting Started

### Checkout

1. `git pull`

### Server

See API documentation below. To start do the server:

1. `cd server`
2. `npm i`
3. `npm run build`
4. `npm run test`
5. `npm run start`

## Start Client 
1. `cd client`
2. `npm run start`

## API Documentation

API Server is an expressjs app. All endpoints except login requires an
'Authorization' header contaning the username of the current user.

API POST/PUT requires JSON in the req.body.

### POST /login
Param: `{ username: <username> }`

Creates a user with <username>. Returning user object. If user does not exists it is created.

### GET /items
Resolves the current user's items

### PUT /items
Param: `{itemId: <item id of item being purchased>}`
Purchases an item for the current user. Resolves to error if funds are insufficient.

### GET /pokemons
Resolves the current user's pokemons

### PUT /pokemons
Param: `{name: <item id of item being purchased>}`
Update current user's pokemon nickname. Resolves to pokemon object



