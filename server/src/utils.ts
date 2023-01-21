import { PokemonClient } from 'pokenode-ts';

function validateUsername(username: string) {
  return username.match(/^[a-zA-Z0-9]{3,50}$/);
}

// When users sign in they get random choices of starters.
async function getStarters() {
  const api = new PokemonClient();
  // Starters!
  const pdexNumbers: number[] = [1, 5, 7];
  const starters = await Promise.all(
    pdexNumbers.map((id) => api.getPokemonById(id))
  );
  return starters;
}

export { getStarters, validateUsername };
