const fs = require('fs');
const axios = require('axios');
const { makeWASocket, Baileys } = require('@whiskeysockets/baileys');
const pino = require('pino');

const client = new Baileys();
const prefix = '!';
const logger = pino();

client.on('auth-state-update', (authState) => {
    console.log('Session du bot:', authState);
});

client.on('chat-update', async (update) => {
    if (update.messages && update.messages.length) {
        const message = update.messages[0];
        const { body, from, isGroupMsg } = message;

        if (body.startsWith(prefix)) {
            handleCommand(body.slice(1).trim(), from, isGroupMsg);
        } else {
            // Si le message ne commence pas par le préfixe, traiter comme un message de chat avec GPT-3
            const response = await chatWithGPT(body);
            sendMessage(from, response);
        }
    }
});

function handleCommand(command, sender, isGroup) {
    switch (command) {
        case 'help':
            sendMessage(sender, 'Liste des commandes : !help, !info, !tagall');
            break;
        case 'info':
            sendMessage(sender, 'Informations sur le bot...');
            break;
        case 'tagall':
            if (isGroup) {
                mentionAll(sender);
            } else {
                sendMessage(sender, 'Cette commande fonctionne uniquement dans les groupes.');
            }
            break;
        default:
            sendMessage(sender, 'Commande inconnue. Tapez !help pour la liste des commandes.');
    }
}

async function chatWithGPT(message) {
    const apiKey = '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';
    const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';

    try {
        const response = await axios.post(apiUrl, {
            prompt: message,
            max_tokens: 100,
        }, {
            headers: {
                'Authorization': Bearer ${apiKey},
                'Content-Type': 'application/json',
            },
        });

        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Erreur lors de la requête à l\'API OpenAI:', error.message);
        return 'Désolé, une erreur s\'est produite lors de la réponse à votre message.';
    }
}

function sendMessage(to, text) {
    client.sendMessage({ to, content: text });
}

client.connect();
logger.info('Le bot WhatsApp a démarré avec succès.');
