import { DexieDatabase } from './dexie-db'

const seeder = async (db: DexieDatabase) => {
  const allFolder = await db.Folder.get('ALL')
  if (!allFolder) {
    const now = Date.now()
    await db.Folder.add({
      id: 'ALL',
      name: 'All',
      createdAt: now,
      modifiedAt: now,
    })
  }
  console.log('All Data Seeded Successfully!')
}

export default seeder
