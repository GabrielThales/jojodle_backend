// 1. A CORREÇÃO: Carregar o .env PRIMEIRO
import * as dotenv from 'dotenv';
dotenv.config();
// --- LOG DE DEBUG 1 ---
console.log("\n[LOG] 1. genkit.conf.ts - Ficheiro INICIADO. Carregando .env...");
// 2. Importar TUDO o que precisamos
import { gemini20Flash, googleAI } from "@genkit-ai/googleai";
import { genkit } from "genkit";
import { z } from 'zod';
// 3. Criar a instância 'ai'
export const ai = genkit({
    plugins: [
        googleAI(),
    ],
    model: gemini20Flash
});
// --- LOG DE DEBUG 2 ---
console.log("[LOG] 2. genkit.conf.ts - Instância 'ai' criada.");
// 4. Mover o Schema para aqui
const characterSchema = z.object({
    name: z.string().describe("Nome completo do personagem"),
    age: z.number().describe("Idade principal do personagem (número)"),
    part: z.number().describe("Parte principal de Jojo (número)"),
    nationality: z.string().describe("Nacionalidade do personagem"),
    gender: z.string().describe("Gênero do personagem"),
    stand: z.string().describe("Nome do Stand (ou 'Nenhum')"),
    imageUrl: z.string().url().describe("URL pública de uma imagem do personagem")
});
// 5. Mover o Prompt para aqui
const generationPrompt = `
  Você é um especialista no universo de 'Jojo's Bizarre Adventure'.
  Sua tarefa é selecionar um (1) personagem jogável para um jogo de adivinhação.
  O personagem deve ser do vasto universo de Jojo (Partes 1-9).

  Você DEVE formatar sua resposta *apenas* como um objeto JSON, 
  seguindo o esquema fornecido. Não inclua NENHUM texto 
  antes ou depois do JSON.
`;
// 6. Mover o Flow para aqui
export const getCharacterOfTheDayV2 = ai.defineFlow({
    name: "getCharacterOfTheDayV2",
    inputSchema: z.undefined(),
    outputSchema: characterSchema
}, async () => {
    // --- LOG DE DEBUG 3 ---
    console.log("[LOG] 3. FLOW 'getCharacterOfTheDayV2' FOI EXECUTADO!");
    const response = await ai.generate({
        prompt: generationPrompt,
        output: {
            schema: characterSchema
        }
    });
    if (!response.output) {
        throw new Error("Falha ao gerar dados do personagem. A resposta do modelo foi nula.");
    }
    return response.output;
});
// --- LOG DE DEBUG 4 ---
console.log("[LOG] 4. genkit.conf.ts - Flow 'getCharacterOfTheDayV2' FOI DEFINIDO.\n");
