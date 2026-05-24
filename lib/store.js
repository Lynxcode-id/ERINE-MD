/**
 * @param {import('@whiskeysockets/baileys').WASocket} conn
 */
function bind(conn) {
    if (!conn.chats) conn.chats = {}
    
    /**
     * @param {import('@whiskeysockets/baileys').Contact[]|{contacts:import('@whiskeysockets/baileys').Contact[]}} contacts 
     * @returns 
     */
    function updateNameToDb(contacts) {
        if (!contacts) return
        try {
            contacts = contacts.contacts || contacts
            for (const contact of contacts) {
                if (!contact.id) continue 
                const id = conn.decodeJid(contact.id)
                if (!id || id === 'status@broadcast') continue
                let chats = conn.chats[id]
                if (!chats) chats = conn.chats[id] = { ...contact, id }
                conn.chats[id] = {
                    ...chats,
                    ...({
                        ...contact, id, ...(id.endsWith('@g.us') ?
                            { subject: contact.subject || contact.name || chats.subject || '' } :
                            { name: contact.notify || contact.name || chats.name || chats.notify || '' })
                    } || {})
                }
            }
        } catch (e) {
            console.error('[STORE] Error updateNameToDb:', e)
        }
    }

    conn.ev.on('contacts.upsert', updateNameToDb)
    conn.ev.on('groups.update', updateNameToDb)
    conn.ev.on('contacts.set', updateNameToDb)
    
    conn.ev.on('chats.set', async ({ chats }) => {
        try {
            for (let { id, name, readOnly } of chats) {
                id = conn.decodeJid(id)
                if (!id || id === 'status@broadcast') continue
                const isGroup = id.endsWith('@g.us')
                let chatsDb = conn.chats[id]
                if (!chatsDb) chatsDb = conn.chats[id] = { id }
                chatsDb.isChats = !readOnly
                if (name) chatsDb[isGroup ? 'subject' : 'name'] = name
                
                if (isGroup && typeof conn.groupMetadata === 'function') {
                    const metadata = await conn.groupMetadata(id).catch(_ => null)
                    if (name || metadata?.subject) chatsDb.subject = name || metadata.subject
                    if (!metadata) continue
                    chatsDb.metadata = metadata
                }
            }
        } catch (e) {
            console.error('[STORE] Error chats.set:', e)
        }
    })

    conn.ev.on('group-participants.update', async function updateParticipantsToDb({ id, participants, action }) {
        try { 
            if (!id) return
            id = conn.decodeJid(id)
            if (id === 'status@broadcast') return
            if (!(id in conn.chats)) conn.chats[id] = { id }
            
            let chats = conn.chats[id]
            chats.isChats = true
            
            if (typeof conn.groupMetadata === 'function') {
                const groupMetadata = await conn.groupMetadata(id).catch(_ => null)
                if (!groupMetadata) return
                chats.subject = groupMetadata.subject
                chats.metadata = groupMetadata
            }
        } catch (e) {
            console.error('[STORE] Error group-participants.update:', e)
        }
    })

    conn.ev.on('groups.update', async function groupUpdatePushToDb(groupsUpdates) {
        try {
            for (const update of groupsUpdates) {
                if (!update.id) continue
                const id = conn.decodeJid(update.id)
                if (!id || id === 'status@broadcast') continue
                const isGroup = id.endsWith('@g.us')
                if (!isGroup) continue
                
                let chats = conn.chats[id]
                if (!chats) chats = conn.chats[id] = { id }
                chats.isChats = true
                
                if (typeof conn.groupMetadata === 'function') {
                    const metadata = await conn.groupMetadata(id).catch(_ => null)
                    if (metadata) chats.metadata = metadata
                    if (update.subject || metadata?.subject) chats.subject = update.subject || metadata.subject
                }
            }
        } catch (e) {
            console.error('[STORE] Error groups.update:', e)
        }
    })

    conn.ev.on('chats.upsert', function chatsUpsertPushToDb(chatsUpsert) {
        try {
            let chats = Array.isArray(chatsUpsert) ? chatsUpsert : [chatsUpsert]
            for (const chat of chats) {
                const { id, name } = chat
                if (!id || id === 'status@broadcast') continue
                const decodedId = conn.decodeJid(id)
                conn.chats[decodedId] = { ...(conn.chats[decodedId] || {}), ...chat, isChats: true }
                const isGroup = decodedId.endsWith('@g.us')
                
                if (isGroup && typeof conn.insertAllGroup === 'function') {
                    conn.insertAllGroup().catch(() => {})
                }
            }
        } catch (e) {
            console.error('[STORE] Error chats.upsert:', e)
        }
    })

    conn.ev.on('presence.update', async function presenceUpdatePushToDb({ id, presences }) {
        try {
            const sender = Object.keys(presences)[0] || id
            const _sender = conn.decodeJid(sender)
            
            const presence = presences[sender]?.lastKnownPresence || 'composing'
            
            let chats = conn.chats[_sender]
            if (!chats) chats = conn.chats[_sender] = { id: sender }
            chats.presences = presence
            
            if (id.endsWith('@g.us')) {
                const decodedGroup = conn.decodeJid(id)
                let groupChats = conn.chats[decodedGroup]
                if (!groupChats && typeof conn.groupMetadata === 'function') {
                    const metadata = await conn.groupMetadata(decodedGroup).catch(_ => null)
                    if (metadata) conn.chats[decodedGroup] = { id: decodedGroup, subject: metadata.subject, metadata, isChats: true }
                }
            }
        } catch (e) {
            console.error('[STORE] Error presence.update:', e)
        }
    })
}

export default {
    bind
}
