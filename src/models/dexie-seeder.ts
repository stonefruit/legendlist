import { DexieDatabase } from './dexie-db'

const seeder = async (db: DexieDatabase) => {
  const inboxFolder = await db.Folder.get('INBOX')
  if (!inboxFolder) {
    const now = Date.now()
    await db.Folder.add({
      id: 'INBOX',
      name: 'Inbox',
      createdAt: now,
      modifiedAt: now,
    })
  }
  console.log('All Data Seeded Successfully!')
}

export default seeder
