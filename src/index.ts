import { z } from 'zod';
// 1. A CORREÇÃO: Importar a instância 'ai' do nosso ficheiro de config
import { ai } from './genkit.conf.js';

console.log("[LOG] 4. index.ts - Ficheiro INICIADO. Importou 'ai'.");

// --- O 'Schema' (O seu código estava perfeito) ---
const characterSchema = z.object({
  name: z.string().describe("Nome completo do personagem"),
  age: z.number().describe("Idade principal do personagem (número)"),
  part: z.number().describe("Parte principal de Jojo (número)"),
  nationality: z.string().describe("Nacionalidade do personagem"),
  gender: z.string().describe("Gênero do personagem"),
  stand: z.string().describe("Dica referente o Stand (ou 'Nenhum')"),
  imageUrl: z.string().url().describe("URL pública de uma imagem do personagem")
});

// --- O 'Prompt' (O seu código estava perfeito) ---
const generationPrompt = `
  Você é um especialista no universo de 'Jojo's Bizarre Adventure'.
  Sua tarefa é selecionar um (1) personagem jogável para um jogo de adivinhação.
  O personagem deve ser do vasto universo de Jojo (Partes 1-9).

  REGRAS IMPORTANTES:
  1. Você DEVE formatar sua resposta *apenas* como um objeto JSON, 
     seguindo o esquema fornecido. Não inclua NENHUM texto 
     antes ou depois do JSON.
  
  2. **Todos os valores de string (como 'nationality' e 'gender') DEVEM
     ser retornados em Português do Brasil.**
     (Exemplo: "Britânico" em vez de "British", "Italiano" em vez de "Italian", "Masculino" em vez de "Male").
  
  3. Nomes próprios (como 'Jotaro Kujo') e nomes de Stands (como 'Star Platinum') 
     devem ser mantidos no original, pois não possuem tradução.
`;

// 2. Usar a instância 'ai' importada para definir o flow
export const getCharacterOfTheDayV2 = ai.defineFlow(
    {
        name: "getCharacterOfTheDayV2",
        inputSchema: z.object({}),
        outputSchema: characterSchema
    },
    async () => {

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
    }
);
console.log("[LOG] 5. index.ts - Flow 'getCharacterOfTheDayV2' FOI DEFINIDO.");