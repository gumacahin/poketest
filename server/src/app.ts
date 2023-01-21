import express, { NextFunction } from 'express';
import bodyParser from 'body-parser';
import { getStarters, validateUsername } from './utils';
import { isEmpty } from 'lodash';
import { PokemonClient } from 'pokenode-ts';
import cors from 'cors';
import helmet from 'helmet';

function authenticate(req: any, res: any, next: NextFunction) {
  // TODO: This will be our bearer token should we proceed with proper auth.
  const username = req.get('Authorization');
  if (!username) {
    res.status(401).send({
      error: {
        title: 'Not allowed.',
        detail: 'Please authenticate.'
      }
    });
  } else {
    next();
  }
}

function createApp(db: any) {
  const app = express();

  app.use(bodyParser.json());
  app.use(cors());
  app.use(helmet());
  app.disable('x-powered-by');

  // define a route handler for the default home page
  app.get('/', authenticate, (req, res) => {
    res.send('Hello world!');
  });

  app.post('/login', async (req, res) => {
    if (!req.body.username) {
      res.status(400).json({
        error: {
          title: 'Username is required.',
          detail: 'Username is required to login.'
        }
      });
      return;
    }

    if (!validateUsername(req.body.username)) {
      res.status(400).json({
        error: {
          title: 'Invalid username.',
          details:
            'Username must be composed of alphamumeric characters and between 3-10 characters long.'
        }
      });
      return;
    }

    let user = await db('users')
      .first(['id', 'username', 'cash', 'pokemon_id'])
      .where('username', req.body.username);

    if (isEmpty(user)) {
      await db('users').insert({ username: req.body.username });
    }

    user = await db('users')
      .first(['id', 'username', 'cash', 'pokemon_id'])
      .where('username', req.body.username);

    res.send({ user });
  });

  app.get('/starters', authenticate, async (req, res) => {
    const starters = await getStarters();
    res.json({
      starters
    });
  });

  app.get('/items', authenticate, async (req, res) => {
    const username = req.get('Authorization');
    const user = await db('users').first(['id']).where({ username });

    if (!user) {
      res.status(401).send({
        error: {
          title: 'User not found.',
          detail: 'Please authenticate.'
        }
      });
      return;
    }

    const items = await db
      .from('users_items as ui')
      .join('items as i', function () {
        this.on('i.id', '=', 'ui.item_id');
      })
      .select({ name: 'i.name', price: 'i.price' })
      .where('ui.user_id', user.id);
    res.json({
      items
    });
  });

  app.post('/items', authenticate, async (req, res) => {
    const username = req.get('Authorization');
    const user = await db('users').first(['id', 'cash']).where({ username });

    if (!user) {
      res.status(401).send({
        error: {
          title: 'User not found.',
          detail: 'Please authenticate.'
        }
      });
      return;
    }

    if (!req.body.itemId) {
      res.status(400).send({
        error: {
          title: 'Item required.',
          detail: 'Id of item being purchased is required.'
        }
      });
      return;
    }

    const item = await db('items')
      .first(['name', 'price'])
      .where('id', req.body.itemId);

    if (!item) {
      res.status(400).send({
        error: {
          title: 'No such item.',
          detail: 'Item does not exist.'
        }
      });
    }

    if (item.price > user.cash) {
      res.status(400).send({
        error: {
          title: 'Insufficient funds.',
          detail: 'Not enough funds to purchase this item.'
        }
      });
    }

    try {
      await db.transaction(async (trx: any) => {
        await trx('users_items').insert({
          user_id: user.id,
          item_id: req.body.itemId
        });

        await trx('users')
          .update({
            cash: trx.raw('cash - (?)', [item.price])
          })
          .where('id', user.id);
      });

      res.send({ item });
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.error(e);
      res.status(500).send({
        error: {
          title: 'Something went wrong.',
          detail: 'Unable to process. Please try again in a few minutes.'
        }
      });
    }
  });

  app.post('/pokemons', authenticate, async (req, res) => {
    const username = req.get('Authorization');
    const user = await db('users').first(['id']).where({ username });

    if (!user) {
      res.status(401).send({
        error: {
          title: 'User not found.',
          detail: 'Please authenticate.'
        }
      });
      return;
    }

    try {
      const starter = await db.transaction(async (trx: any) => {
        await trx('pokemons').insert({
          user_id: user.id,
          pokedex_number: req.body.id,
          name: '',
          level: 1
        });

        const newStarter = await trx('pokemons')
          .first()
          .where('user_id', user.id);

        await trx('users')
          .update({
            pokemon_id: newStarter.id
          })
          .where('id', user.id);

        return newStarter;
      });

      const api = new PokemonClient();
      const pokemon = await api.getPokemonById(starter.pokedex_number);
      res.send({ pokemon, starter });
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.error(e);
      res.status(500).send({
        error: {
          title: 'Something went wrong.',
          detail: 'Unable to process. Please try again in a few minutes.'
        }
      });
    }
  });

  app.put('/pokemons', authenticate, async (req, res) => {
    const username = req.get('Authorization');
    const user = await db('users').first(['id', 'cash']).where({ username });

    if (!user) {
      res.status(401).send({
        error: {
          title: 'User not found.',
          detail: 'Please authenticate.'
        }
      });
      return;
    }

    await db('pokemons')
      .update('name', req.body.name)
      .where('user_id', user.id);

    const pokemon = await db('pokemons').first().where('user_id', user.id);

    res.send({ pokemon });
  });

  app.get('/pokemons', authenticate, async (req, res) => {
    const username = req.get('Authorization');
    const user = await db('users').first(['id', 'cash']).where({ username });

    if (!user) {
      res.status(401).send({
        error: {
          title: 'User not found.',
          detail: 'Please authenticate.'
        }
      });
      return;
    }

    const starter = await db('pokemons')
      .first(['id', 'level', 'name', 'pokedex_number'])
      .where({ user_id: user.id });

    const api = new PokemonClient();
    const pokemon = await api.getPokemonById(starter.pokedex_number);
    res.send({ pokemon, starter });
  });

  app.get('/shop', authenticate, async (req, res) => {
    const items = await db('items').select(['id', 'name', 'price']);
    res.send({ items });
  });

  app.get('/user', authenticate, async (req, res) => {
    const username = req.get('Authorization');
    const user = await db('users').first().where({ username });
    if (!user) {
      res.status(401).send({
        error: {
          title: 'User not found.',
          detail: 'Please authenticate.'
        }
      });
      return;
    }
    res.send({ user });
  });

  // custom 404
  app.use((req, res, next) => {
    res.status(404).send({ error: { title: 'Not found' } });
  });

  return app;
}

export default createApp;
