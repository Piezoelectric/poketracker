import express from "express";
import { db } from "./prisma/db";
import cors from "cors";

import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express();
const port = 3001;

app.use(
  cors({
    credentials: true,
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
    origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  })
);

app.use(express.json()) // adds support for x-www-form-urlencoded, among other things

app.listen(port, () => {
  console.log(`PokeTracker server listening on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

/*
  Create [admin]: pokemon [bulk pokemon?]
  Read: single pokemon, bulk pokemon
    Client should use the "read bulk pokemon" endpoint
  Update [admin]: pokemon [bulk pokemon?]
  Delete [admin]: pokemon [bulk pokemon?]
*/

const handleRequestError = (req, res, e) => {
  let errorMsg = e?.message
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2002') {
      errorMsg = "Unique constraint failed:" + String(e.meta.target)
    }
  } else if (e instanceof Prisma.PrismaClientValidationError) {
    errorMsg = "Validation error: check that all required fields have been included (name, dex_number, type_1)"
  }
  res.status(500).json({
    errors: errorMsg,
    input: req.body
  })
}

// Create
app.post('/pokemon', async (req, res) => {
  const { name, dex_number, type_1, type_2, image_url } = req.body
  try {
    const newPokemon = await prisma.pokemon.create({
      data: {
        name,
        dex_number,
        type_1,
        type_2,
        image_url
      }
    })
    res.json(newPokemon)
  } catch (e) {
    handleRequestError(req, res, e)
  }
})

// Read 
app.get('/pokemon', async (req, res) => {
  const pokemonList = await prisma.pokemon.findMany()
  res.json(pokemonList)
})

app.get('/pokemon/:dexNumber', async (req, res) => {
  const { dexNumber: dex_number } = req.params
  const pokemon = await prisma.pokemon.findFirst({
    where: {
      dex_number: Number(dex_number)
    }
  })
  if (!pokemon) {
    res.status(404).json({
      errors: "pokemon not found",
      dex_number
    })
  } else {
    res.json(pokemon)
  }
})

// Update
app.put('/pokemon', async (req, res) => {
  const { name, dex_number, type_1, type_2, image_url } = req.body
  // For simplicity we assume dex_number stays fixed and can be used as lookup.
  // In the real world it's possible a human could mis-enter a dex number, 
  // but here we'll assume otherwise.
  try {
    const updatedPokemon = await prisma.pokemon.update({
      where: { dex_number },
      data: {
        name,
        dex_number,
        type_1,
        type_2,
        image_url
      }
    })
    res.json(updatedPokemon)
  } catch (e) {
    handleRequestError(req, res, e)
  }
})

// Delete
app.delete('/pokemon/:dexNumber', async (req, res) => {
  const { dexNumber: dex_number } = req.params
  try {
    const deletedPkmn = await prisma.pokemon.delete({
      where: { dex_number: Number(dex_number) }
    })
    res.json({
      deletedPkmn
    })
  } catch (e) {
    handleRequestError(req, res, e)
  }
})