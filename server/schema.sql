PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
DROP TABLE IF EXISTS users_items;
CREATE TABLE users_items (user_id integer not null, item_id int unsigned not null);
DROP TABLE IF EXISTS items;
CREATE TABLE items (id integer primary key, name varchar not null, price int unsigned not null);
INSERT INTO items VALUES(null,'Bottle of water',20);
INSERT INTO items VALUES(null,'rare candy',100);
INSERT INTO items VALUES(null,'ultra ball',500);
DROP TABLE IF EXISTS users;
CREATE TABLE users (id integer primary key, username varchar not null unique, cash int unsigned not null default 150, pokemon_id integer, created_at datetime default current_timestamp, updated_at datetime current_timestamp);
DROP TABLE IF EXISTS pokemons;
CREATE TABLE pokemons (id integer primary key, user_id integer not null unique, pokedex_number integer not null, name varchar not null, level integer not null);
COMMIT;
