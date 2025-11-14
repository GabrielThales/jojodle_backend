"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJojoTip = exports.getListCharacter = exports.getCharacterOfTheDayV2 = void 0;
const zod_1 = require("zod");
// 1. A CORREÇÃO: Importar a instância 'ai' do nosso ficheiro de config
const genkit_conf_js_1 = require("./genkit.conf.js");
console.log("[LOG] 4. index.ts - Ficheiro INICIADO. Importou 'ai'.");
// --- O 'Schema' (O seu código estava perfeito) ---
const characterSchema = zod_1.z.object({
    name: zod_1.z.string().describe("Nome completo do personagem"),
    age: zod_1.z.number().describe("Idade principal do personagem (número)"),
    part: zod_1.z.number().describe("Parte principal de Jojo (número)"),
    nationality: zod_1.z.string().describe("Nacionalidade do personagem"),
    gender: zod_1.z.string().describe("Gênero do personagem"),
    stand: zod_1.z.string().describe("Dica referente o Stand (ou 'Nenhum')"),
    imageUrl: zod_1.z.string().url().describe("URL pública de uma imagem do personagem")
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
exports.getCharacterOfTheDayV2 = genkit_conf_js_1.ai.defineFlow({
    name: "getCharacterOfTheDayV2",
    inputSchema: zod_1.z.object({}),
    outputSchema: characterSchema
}, async () => {
    const response = await genkit_conf_js_1.ai.generate({
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
console.log("[LOG] 5. index.ts - Flow 'getCharacterOfTheDayV2' FOI DEFINIDO.");
const promtListCharacter = `Você é um especialista absoluto no universo de JoJo's Bizarre Adventure.
Sua única tarefa é preencher os dados solicitados sobre os protagonistas e antagonistas de cada parte da série.

Instruções:
1. Liste todos os personagens da nona parte de Jojo, é necessário que contenha todos os vilões enfrentados por Jodio Joestar e seus aliados ao decorrer da temporada até o final.
2. Siga *estritamente* o schema de saída (output schema) fornecido na requisição.
3. Não adicione nenhum texto introdutório, explicações, saudações ou conclusões. Sua resposta deve ser *apenas* o objeto JSON estruturado.
4. As urls das imagens devem ser públicas e acessíveis.
5. Todos os valores de string (como 'nationality' e 'gender     ') DEVEM ser retornados em Português do Brasil.
   (Exemplo: "Britânico" em vez de "British", "Italiano" em vez de "Italian", "Masculino" em vez de "Male").
6. Nomes próprios (como 'Jotaro Kujo') e nomes de Stands (como 'Star Platinum') devem ser mantidos no original, pois não possuem tradução.
`;
const listJojoSchema = zod_1.z.object({
    partes: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().describe("Nome completo do personagem"),
        age: zod_1.z.number().describe("Idade principal do personagem (número)"),
        part: zod_1.z.number().describe("Parte principal de Jojo (número)"),
        nationality: zod_1.z.string().describe("Nacionalidade do personagem"),
        gender: zod_1.z.string().describe("Gênero do personagem"),
        stand: zod_1.z.string().describe("Nome do Stand (ou 'Nenhum')"),
        imageUrl: zod_1.z.string().url().describe("URL pública de uma imagem do personagem e acessível")
    })).describe("Uma lista de todas as partes de JoJo's Bizarre Adventure"),
});
//Endpoint utilizado para popular o banco de dados Firestore de cada temporada de acordo com o prompt acima, especificando cada temporada uma por vez.
exports.getListCharacter = genkit_conf_js_1.ai.defineFlow({
    name: "getListCharacter",
    inputSchema: zod_1.z.object({}),
    outputSchema: listJojoSchema
}, async () => {
    const response = await genkit_conf_js_1.ai.generate({
        prompt: promtListCharacter,
        output: {
            schema: listJojoSchema
        }
    });
    if (!response.output) {
        throw new Error("Falha ao gerar dados do personagem. A resposta do modelo foi nula.");
    }
    // Salvar cada personagem no Firestore
    /*for (const character of response.output.partes){
        addDocument("jojo_characters", character);
    }*/
    return response.output;
});
const characterInputSchema = zod_1.z.object({
    nomeDoPersonagem: zod_1.z.string(),
});
const outputSchemaTip = zod_1.z.object({
    tip: zod_1.z.string().describe("Uma dica curta e sutil sobre o personagem.")
});
exports.getJojoTip = genkit_conf_js_1.ai.defineFlow({
    name: "getJojoTip",
    inputSchema: characterInputSchema,
    outputSchema: outputSchemaTip
}, async (input) => {
    const { nomeDoPersonagem } = input;
    const promptJojoTip = `
                Você é um especialista em Jojo's Bizarre Adventure. O personagem secreto é ${nomeDoPersonagem}.
                O jogador precisa de uma dica.

                Pense sobre a personalidade, habilidades e impacto na trama deste personagem.

                Com base nessa análise, gere UMA (1) única dica de string curta.

                REGRAS DA DICA:
                1. Deve ser em Português do Brasil.
                2. NÃO deve conter o nome do personagem (${nomeDoPersonagem}) ou o nome do seu Stand.
                3. Deve ser sutil, mas útil.
                (Exemplo para Jotaro: "Ele viajou ao Egito para salvar sua mãe.")
            `;
    const response = await genkit_conf_js_1.ai.generate({
        prompt: promptJojoTip,
        output: {
            schema: outputSchemaTip
        },
        config: {
            temperature: 0.7
        }
    });
    if (!response.output) {
        throw new Error("Falha ao gerar dados do personagem. A resposta do modelo foi nula.");
    }
    return response.output;
});
