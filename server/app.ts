import express from "express";
import { db } from "./prisma/db";
import cors from "cors";
import jwt from "jsonwebtoken";

import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express();
const port = 3001;

const jwtSecret = process.env.ACCESS_TOKEN_SECRET
const expiresIn = Number(process.env.TOKEN_EXP_IN_SECONDS)

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

// TODO: split this off into utils, routing file, etc.

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

const authenticateJwt = (req, res, onSuccess) => {
  const { authorization } = req.headers
  if (authorization && authorization.length > 0) {
    const bearerToken = authorization.split(" ")[1]
    jwt.verify(bearerToken, jwtSecret, (err: any, user: any) => {
      if (err) {
        res.status(403).json({
          message: "token error"
        })
      } else {
        req.user = user
        onSuccess(req, res)
      }
    })
  } else {
    res.status(403).json({
      message: "unauthorized"
    })
  }
}

// Create
const handleCreate = async (req, res) => {
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
}

app.post('/pokemon', async (req, res) => {
  authenticateJwt(req, res, handleCreate)
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
const handleUpdate = async (req, res) => {
  try {
    const { name, dex_number, type_1, type_2, image_url } = req.body
    // For simplicity we assume dex_number stays fixed and can be used as lookup.
    // In the real world it's possible a human could mis-enter a dex number, 
    // but here we'll assume otherwise.
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
}

app.put('/pokemon', async (req, res) => {
  authenticateJwt(req, res, handleUpdate)
})

const handleDelete = async (req, res) => {
  try {
    const { dexNumber: dex_number } = req.params
    const deletedPkmn = await prisma.pokemon.delete({
      where: { dex_number: Number(dex_number) }
    })
    res.json({
      deletedPkmn
    })
  } catch (e) {
    handleRequestError(req, res, e)
  }
}

// Delete
app.delete('/pokemon/:dexNumber', async (req, res) => {
  authenticateJwt(req, res, handleDelete)
})

// Login: username + password. Return token.
// Obviously this is horribly insecure and a real authe/authz system would have
// password hashing, salting, oauth, passwordless auth (see below) ... 
// but owing to time constraints I'm not going to implement those.
// https://www.prisma.io/blog/backend-prisma-typescript-orm-with-postgresql-auth-mngp1ps7kip4

app.post('/login', async (req, res) => {
  const { authorization } = req.headers
  const decodedAuth = Buffer.from(authorization.split(" ")[1], 'base64').toString()
  const [email, password] = decodedAuth.split(":")
  try {
    const user = await prisma.user.findFirst({
      where: {
        AND: [
          { email },
          { password }
        ]
      }
    })
    if (user && email && password) {
      const token = jwt.sign(req.body, jwtSecret, {
        expiresIn
      })
      res.json({
        token
      })
    } else {
      res.status(400).json({
        error: "Invalid email or password"
      })
    }
  } catch (e) {
    handleRequestError(req, res, e)
  }
})
