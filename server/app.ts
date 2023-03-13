import express from "express";
import { db } from "./prisma/db";
import cors from "cors";

import { PrismaClient } from '@prisma/client'

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

app.listen(port, () => {
  console.log(`PokeTracker server listening on port ${port}`);
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

/*
  Create [admin]: pokemon [bulk pokemon?]
  Read: single pokemon, bulk pokemon
    Client should use this endpoint
  Update [admin]: pokemon [bulk pokemon?]
  Delete [admin]: pokemon [bulk pokemon?]
*/

app.get('/pokemon', async (req, res) => {
  const pokemonList = await prisma.pokemon.findMany()
  res.json(pokemonList)
})