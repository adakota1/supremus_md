const fs = require('fs');
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');
const axios = require('axios');
const menuText = require('./commandes/menu.js'); // Importez le contenu de menu.js
async function bot() {
    const auth = await useMultiFileAuthState('session');
    const socket = makeWASocket({
        printQRInTerminal: true,
        browser: ['Supremus-Bot-MD', 'safari', '1.0.0'],
        auth: auth.state,
        logger: pino({ level: "silent" })
    });
// Fonction pour récupérer le lien d'invitation du groupe où la commande est exécutée
async function getGroupInviteLink(socket, message) {
    try {
        // Obtenir l'identifiant du groupe à partir du message
        const groupId = message.key.remoteJid;

        // Obtenir le code d'invitation du groupe
        const inviteCode = await socket.groupInviteCode(groupId);

        // Générer le lien d'invitation à partir du code
        const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

        return inviteLink;
    } catch (error) {
        console.error("Erreur lors de la récupération du lien d'invitation du groupe :", error);
        return null;
    }
}
async function getAdmin(socket, message) {
    try {
        const groupId = message.key.remoteJid;
        const groupMetadata = await socket.groupMetadata(groupId);
        const participants = groupMetadata.participants;
        const admins = participants.filter(participant => participant.isAdmin);
        const adminJids = admins.map(admin => admin.jid);
        return adminJids;
    } catch (error) {
        console.error("Erreur lors de la récupération des administrateurs du groupe :", error);
        return [];
    }
}
    socket.ev.on("creds.update", auth.saveCreds);
    socket.ev.on("connection.update", ({ connection }) => {
        if (connection === "open") {
            console.log("le projet est réussi...!");
        }
        if (connection === "close") {
            bot();
        }
    });

    socket.ev.on("messages.upsert", async ({ messages }) => {0
        for (const message of messages) {
            const bebas = message;
            const cmd = bebas.message.conversation.toLocaleLowerCase();
        
            function reply(text) {
                socket.sendMessage(bebas.key.remoteJid, { text: text }, {
                    quoted: bebas
                });
            }
        
                
                
            switch (cmd) {
                case 'ping': {
                    reply("pong");
                    const reactionMessage = {
                        react: {
                            text: "👾", // use an empty string to remove the reaction
                            key: bebas.key
                        }
                    }
                    
                    const sendMsg = await socket.sendMessage(bebas.key.remoteJid, reactionMessage);
                    break;
                }
                case 'bot': {
                    reply(" 𝐥𝐞 𝐁𝐎𝐓 𝐬𝐮𝐩𝐫𝐞𝐦𝐮𝐬_𝐌𝐃 𝐞𝐬𝐭 𝐞𝐧 𝐜𝐨𝐮𝐫𝐬 𝐝𝐞 𝐝é𝐯𝐞𝐥𝐨𝐩𝐩𝐞𝐦𝐞𝐧𝐭 𝐩𝐨𝐮𝐫 𝐥'𝐢𝐧𝐬𝐭𝐚𝐧𝐭 👾");
                    break;
                }
                case 'contact': {
                    const vcard = 'BEGIN:VCARD\n' + 
                                  'VERSION:3.0\n' + 
                                  'FN:𝐥𝐮𝐟𝐟𝐲_𝐳𝐞𝐧𝐨 \n' + 
                                  'TEL;type=CELL;type=VOICE;waid=22891532394:+228 91532394\n' + 
                                  'END:VCARD';

                    const sentMsg = await socket.sendMessage(
                        bebas.key.remoteJid,
                        { 
                            contacts: { 
                                displayName: '𝐥𝐳𝐞𝐧𝐨 ', 
                                contacts: [{ vcard }] 
                            }
                        }
                    );
                    const reactionMessage = {
                        react: {
                            text: "💖", // use an empty string to remove the reaction
                            key: bebas.key
                        }
                    }
                    
                    const sendMsg = await socket.sendMessage(bebas.key.remoteJid, reactionMessage);
                    break;
                }
                case 'menu': { // Lorsque l'utilisateur envoie .menu
                    // Récupérez le nom de l'utilisateur
                    reply(menuText);
                    break;
                }
                case 'gpp': {
                    try {
                        // Vérifier si le message contient des mentions
                        if (!message.message || !message.message.extendedTextMessage || !message.message.extendedTextMessage.contextInfo || !message.message.extendedTextMessage.contextInfo.mentionedJid) {
                            return reply("Veuillez mentionner une personne pour obtenir sa photo de profil.");
                        }
                        
                        // Récupérer les JID des personnes mentionnées dans le message
                        const mentionedJids = message.message.extendedTextMessage.contextInfo.mentionedJid;
                
                        // Vérifier si une seule personne est mentionnée
                        if (mentionedJids.length !== 1) {
                            return reply("Veuillez mentionner une seule personne à la fois.");
                        }
                
                        // Récupérer le JID de la personne mentionnée
                        const mentionedJid = mentionedJids[0];
                
                        // Récupérer l'URL de la photo de profil de la personne mentionnée (basse résolution)
                        const lowResPpUrl = await socket.profilePictureUrl(mentionedJid);
                        console.log("URL de la photo de profil (basse résolution) :", lowResPpUrl);
                
                        // Récupérer l'URL de la photo de profil de la personne mentionnée (haute résolution)
                        const highResPpUrl = await socket.profilePictureUrl(mentionedJid, 'image');
                        console.log("URL de la photo de profil (haute résolution) :", highResPpUrl);
                
                        // Envoyer les URLs de la photo de profil en réponse
                        reply(URL `de la photo de profil (basse résolution) : ${lowResPpUrl}\nURL de la photo de profil (haute résolution) : ${highResPpUrl}`);
                    } catch (error) {
                        console.error("Erreur lors de la récupération de la photo de profil :", error);
                        reply("Une erreur est survenue lors de la récupération de la photo de profil.");
                    }
                    break;
                }
                
                case 'promouvoir': try{
        // Obtenez l'ID du groupe et d'autres informations
        const groupId = message.key.remoteJid;
        const groupInfo = await getGroupInfo(groupId);

        if (groupInfo) {
            const { groupJid, groupMetadata, participantJids } = groupInfo;
            // Utilisez les informations pour promouvoir quelqu'un
            // (Ajoutez votre logique ici)
        } else {
            reply("Une erreur s'est produite lors de la récupération des informations du groupe.");
        }
        break;
    }
            
        case 'tag': {
                    try {
                        let metadata = await socket.groupMetadata(message.key.remoteJid);
                        let participants = metadata.participants;
                        let msg = `*_______________________________*\nҳ̸Ҳ̸ҳ(⛓️𝙎𝙐𝞠𝞒𝞢𝞛𝙐𝙎-𝞛𝘿⛓️)ҳ̸Ҳ̸ҳ\n*_______________________________*\n𝐥𝐢𝐬𝐭𝐞 𝐝𝐞𝐬 𝐩𝐚𝐫𝐭𝐢𝐜𝐢𝐩𝐚𝐧𝐭𝐬 𝐝𝐮 𝐠𝐫𝐨𝐮𝐩𝐞 👾\n*_______________________________*\n`;
                        let mentionJid = [];
                
                        for (let i = 0; i < participants.length; i++) {
                            msg += '@' + participants[i].id.split('@')[0] + '\n';
                            mentionJid.push(participants[i].id);

                        
                        }
                
                        await socket.sendMessage(message.key.remoteJid, { text: msg, mentions: mentionJid }, { quoted: message });
                    } catch (error) {
                        console.error("Erreur lors de la commande tagall :", error);
                        reply("Erreur lors de la commande tagall.");
                    }
                    break;
                }
                
                case 'all': {
                    try {
                        // Obtenir les métadonnées du groupe pour obtenir la liste des participants
                        const metadata = await socket.groupMetadata(message.key.remoteJid);
                        
                        // Récupérer la liste des participants
                        const participants = metadata.participants;
                
                        // Construire le message avec les mentions de chaque participant
                        let mentionText = '';
                        let mentionJidList = [];
                        for (const participant of participants) {
                            // Ajouter l'identifiant à la liste des mentions
                            mentionJidList.push(participant.id);
                
                            // Construire le texte de mention
                            mentionText += `@${participant.id.split('@')[0]} `;
                        }
                
                        // Envoyer le message avec les mentions
                        await socket.sendMessage(message.key.remoteJid, {
                            text: mentionText,
                            mentions: mentionJidList
                        });
                
                        // Répondre pour confirmer l'envoi du message avec mentions
                        reply('Tous les membres du groupe ont été mentionnés.');
                    } catch (error) {
                        console.error("Erreur lors de la mention de tous les membres du groupe :", error);
                        reply("Erreur lors de la mention de tous les membres du groupe.");
                    }
                    break;
                }
                
                  case 'sendgif': {
                    try {
                        const groupId = message.key.remoteJid;
                        const joke = "𝐇𝐚𝐚𝐚𝐚𝐚 𝐋𝐚𝐢𝐬𝐬𝐞-𝐦𝐨𝐢 𝐭𝐫𝐚𝐧𝐪𝐮𝐢𝐥𝐥𝐞, 𝐛𝐨𝐚 𝐇𝐚𝐧𝐜𝐨𝐜𝐤 ! 𝐉𝐞 𝐩𝐫é𝐟è𝐫𝐞 𝐞𝐧𝐜𝐨𝐫𝐞 𝐚𝐟𝐟𝐫𝐨𝐧𝐭𝐞𝐫 𝐥𝐞𝐬 𝐚𝐦𝐢𝐫𝐚𝐮𝐱 𝐝𝐞 𝐥𝐚 𝐌𝐚𝐫𝐢𝐧𝐞 𝐪𝐮𝐞 𝐝𝐞 𝐭𝐞 𝐜𝐨𝐧𝐭𝐫𝐚𝐫𝐢𝐞𝐫 !";
                        
                        await socket.sendMessage(
                            groupId, 
                            { 
                                video: fs.readFileSync("media/luffy.gif"), 
                                caption: joke,
                                gifPlayback: true
                            }
                        );
                    } catch (error) {
                        console.error("Erreur lors de l'envoi du GIF :", error);
                        reply("Erreur lors de l'envoi du GIF.");
                    }
                    break;
                }
            
                case 'op': {
                    try {
                        const groupId = message.key.remoteJid;
                        const videos = ['video1.mp4', 'video2.mp4', 'video3.mp4', 'video4.mp4', 'video5.mp4', 'video6.mp4', 'video7', 'video8', 'video9', 'video10']; // Liste des vidéos disponibles
                        const randomIndex = Math.floor(Math.random() * videos.length); // Choix aléatoire d'une vidéo
                        const randomVideo = videos[randomIndex]; // Sélection de la vidéo aléatoire
                        const caption = "𝚯𝚴𝚵 𝚸𝚰𝚵𝐂𝚵 >>> 𝚫𝐋𝐋..!*_______________________________*\n𝚩𝐘 𝐒𝐔𝚸𝚪𝚵𝚳𝐔𝐒-𝚳𝐃..!___________\n"; // Légende facultative
                
                        await socket.sendMessage(
                            groupId, 
                            { 
                                video: fs.readFileSync(`media/${randomVideo}`), // Charger la vidéo aléatoire
                                caption: caption,
                                gifPlayback: true // Activer la lecture GIF si possible
                            }
                        );
                    } catch (error) {
                        console.error("Erreur lors de l'envoi de la vidéo aléatoire :", error);
                        reply("Erreur lors de l'envoi de la vidéo aléatoire.");
                    }
                    break;
                }
                case 'hentai': {
                    try {
                        const groupId = message.key.remoteJid;
                        // Remplacez "media/audio_mp3.mp3" par le chemin de votre fichier audio
                        await socket.sendMessage(
                            groupId, 
                            { 
                                audio: { url: "media/audio.mp3" }, 
                                mimetype: 'audio/mpeg' 
                            }
                        );
                    } catch (error) {
                        console.error("Erreur lors de l'envoi du fichier audio :", error);
                        reply("Erreur lors de l'envoi du fichier audio.");
                    }
                    break;
                }
                case 'link': {
                    try {
                        // Récupérer le lien d'invitation du groupe
                        const inviteLink = await getGroupInviteLink(socket, bebas);
                        
                        // Vérifier si le lien d'invitation a été récupéré avec succès
                        if (inviteLink) {
                            // Afficher le message préformaté avec le lien d'invitation
                            const inviteLinkMessage = `❰𝐋𝚰𝚵𝚴 𝐃𝐔 𝐆𝚪𝚯𝐔𝚸𝚵❱\n\n   ╚>▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄                 \n                               \n                       🧷 ɭเєภ✎: ${inviteLink}\n                                 \n     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄<╝`;
                            await socket.sendMessage(bebas.key.remoteJid, { text: inviteLinkMessage });
                        } else {
                            // En cas d'erreur lors de la récupération du lien d'invitation
                            reply("Erreur lors de la récupération du lien d'invitation du groupe.");
                        }
                    } catch (error) {
                        console.error("Erreur lors de l'envoi du lien d'invitation du groupe :", error);
                        reply("Erreur lors de l'envoi du lien d'invitation du groupe.");
                    }
                    break;
                }
                case 'gpd': {
                    try {
                        // Obtenir l'identifiant du groupe à partir du message
                        const groupId = message.key.remoteJid;
                
                        // Vérifier si le message contient une description
                        if (!message.message.extendedTextMessage || !message.message.extendedTextMessage.text) {
                            reply("Veuillez inclure une nouvelle description pour le groupe.");
                            break;
                        }
                
                        // Obtenir la nouvelle description du groupe à partir du message
                        const newDescription = message.message.extendedTextMessage.text.slice(5).trim();
                
                        // Mettre à jour la description du groupe
                        await socket.groupUpdateDescription(groupId, newDescription);
                
                        reply("𝙇𝙖 𝙙𝙚𝙨𝙘𝙧𝙞𝙥𝙩𝙞𝙤𝙣 𝙙𝙪 𝙜𝙧𝙤𝙪𝙥𝙚 𝙖 é𝙩é 𝙢𝙞𝙨𝙚 à 𝙟𝙤𝙪𝙧 𝙖𝙫𝙚𝙘 𝙨𝙪𝙘𝙘è𝙨...!");
                    } catch (error) {
                        console.error("𝙀𝙧𝙧𝙚𝙪𝙧 𝙡𝙤𝙧𝙨 𝙙𝙚 𝙡𝙖 𝙢𝙞𝙨𝙚 à 𝙟𝙤𝙪𝙧 𝙙𝙚 𝙡𝙖 𝙙𝙚𝙨𝙘𝙧𝙞𝙥𝙩𝙞𝙤𝙣 𝙙𝙪 𝙜𝙧𝙤𝙪𝙥𝙚:", error);
                        reply("𝙀𝙧𝙧𝙚𝙪𝙧 𝙡𝙤𝙧𝙨 𝙙𝙚 𝙡𝙖 𝙢𝙞𝙨𝙚 à 𝙟𝙤𝙪𝙧 𝙙𝙚 𝙡𝙖 𝙙𝙚𝙨𝙘𝙧𝙞𝙥𝙩𝙞𝙤𝙣 𝙙𝙪 𝙜𝙧𝙤𝙪𝙥𝙚");
                    }
                    break;
                }
                case 'owner': {
                    reply("𝐥𝐞 𝐩𝐫𝐨𝐩𝐫𝐢é𝐭𝐚𝐢𝐫𝐞 𝐝𝐞 𝐜𝐞 𝐁𝐨𝐭 𝐞𝐬𝐭 𝐥𝐮𝐟𝐟𝐲_𝐳𝐞𝐧𝐨 & 𝐀𝐫𝐧𝐨𝐥𝐝 𝐝𝐫𝐚𝐠𝐧𝐞𝐥"); 
                    const reactionMessage = {
                        react: {
                            text: "☣", // use an empty string to remove the reaction
                            key: bebas.key
                        }
                    }
                    
                    const sendMsg = await socket.sendMessage(bebas.key.remoteJid, reactionMessage);
                    break;
                }
                default:
            }
        }
    });
}

bot();