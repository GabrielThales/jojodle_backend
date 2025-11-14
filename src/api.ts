import express from 'express';
import cors from 'cors';
import { db } from './firebaseService.js';
import { z } from 'zod';
// Importamos nosso banco de dados
import { type Character } from './schemas.js'; // Importamos o TIPO
import { getJojoTipLogic } from './index.js';

console.log("[LOG API] Ficheiro api.ts CARREGADO.");

// 1. Criar a app Express
const app = express();

// 2. Usar Middlewares
app.use(cors({ origin: true })); // Permite chamadas de qualquer origem
app.use(express.json()); // Permite que a app entenda JSON

app.use((req, res, next) => {
  console.log(`[LOG API] Pedido recebido: ${req.method} ${req.originalUrl}`);
  next(); // Continua para as rotas
});

// --- ENDPOINT 1: Retorna toda a coleção ---
app.get('/jojo_characters', async (req, res) => {
  try {
    const collectionRef = db.collection('jojo_characters');
    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "Nenhum personagem encontrado." });
    }

    const characters = snapshot.docs.map(doc => doc.data() as Character);
    return res.status(200).json(characters);

  } catch (error) {
    console.error("Erro ao buscar personagens:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// --- ENDPOINT 2: Retorna o personagem do dia ---
app.get('/character_of_the_day', async (req, res) => {
  try {
    const collectionRef = db.collection('jojo_characters');
    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ error: "Coleção de personagens vazia." });
    }

    const characters = snapshot.docs.map(doc => doc.data() as Character);
    const randomIndex = Math.floor(Math.random() * characters.length);
    
    return res.status(200).json(characters[randomIndex]);

  } catch (error) {
    console.error("Erro ao buscar personagem do dia:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

const characterInputSchema = z.object({
  nomeDoPersonagem: z.string(),
});

app.post('/getJojoTip', async (req, res) => {
  try {
    // 1. Validar a entrada (input)
    const input = characterInputSchema.parse(req.body);
    
    // 2. Chamar a nossa lógica de IA importada
    const tipResult = await getJojoTipLogic(input.nomeDoPersonagem);
    
    // 3. Retornar a resposta
    return res.status(200).json(tipResult); 

  } catch (error) {
    console.error("Erro no endpoint /getJojoTip:", error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
});

const PORT = 3000;

// Mandar o Express "ouvir" nessa porta
app.listen(PORT, () => {
  console.log(`[LOG API] Servidor Express (Dados) a rodar na porta ${PORT}`);
});
