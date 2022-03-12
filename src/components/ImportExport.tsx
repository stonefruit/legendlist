import { format } from 'date-fns'
import Dexie from 'dexie'
import { useEffect, useState } from 'react'
import MyDropzone from '../components/MyDropzone'
import db, { DexieDatabase, mainDbName } from '../models/dexie-db'
import { classNames, delay } from '../utils'

const tempDbName = 'LegendListDatabase_temp'

export default function ImportExport() {
  const [importedContent, setImportedContent] = useState<string | null>(null)
  const [isExportReady, setIsExportReady] = useState(false)
  const [exportTables, setExportTables] = useState({})
  const [isImportReady, setIsImportReady] = useState(false)
  const [isCheckingImportedData, setIsCheckingImportedData] = useState(false)
  const [checkImportErrorText, setCheckImportErrorText] = useState('')
  const [wasImportSuccessful, setWasImportSuccessful] = useState(false)

  const fileDate = format(new Date(), 'yyyy-MM-dd')

  const fileName = `legendlist-export-${fileDate}.json`

  const fileContent = {
    fileName,
    schemaVersion: db.verno,
    tables: exportTables,
  }

  const fileContentString = `data:text/plain;charset=utf-8,${JSON.stringify(
    fileContent
  )}`

  // FUNCTIONS

  const onClickPrepareExport = async () => {
    const { tables } = db
    const tableData: any = {}
    for (let i = 0; i < tables.length; i += 1) {
      const table = tables[i]
      tableData[table.name] = await (db as any)[table.name].toArray()
    }
    setExportTables(tableData)
    setIsExportReady(true)
  }

  const onClickImport = async () => {
    try {
      if (importedContent === null) {
        return
      }
      await Dexie.delete(mainDbName)
      await delay(200)
      console.log('Importing...')
      const newDb = new DexieDatabase(mainDbName)
      await delay(200)
      const importJson = JSON.parse(importedContent)
      const tableNames = Object.keys(importJson.tables)
      for (let i = 0; i < tableNames.length; i += 1) {
        const tableName = tableNames[i]
        const tableData = importJson.tables[tableName]
        await ((newDb as any)[tableName] as Dexie.Table).bulkPut(tableData)
      }
      console.log('Import Successful!')
      setCheckImportErrorText('')
      setWasImportSuccessful(true)
    } catch (err) {
      setCheckImportErrorText((err as any).message as string)
    }
  }

  // EFFECTS

  useEffect(() => {
    if (importedContent === null) {
      return
    }

    const checkImportContent = async () => {
      try {
        setIsImportReady(false)
        setIsCheckingImportedData(true)
        const importJson = JSON.parse(importedContent)
        if (
          !importJson.fileName ||
          !importJson.schemaVersion ||
          !importJson.tables ||
          !Object.keys(importJson.tables) ||
          Object.keys(importJson.tables).length === 0
        ) {
          throw new Error('Invalid import JSON content')
        }
        const tempDb = new DexieDatabase(tempDbName)
        await delay(200)
        const tableNames = Object.keys(importJson.tables)
        for (let i = 0; i < tableNames.length; i += 1) {
          const tableName = tableNames[i]
          const tableData = importJson.tables[tableName]
          await ((tempDb as any)[tableName] as Dexie.Table).bulkPut(tableData)
        }
        setIsImportReady(true)
        setCheckImportErrorText('')
      } catch (err) {
        console.log('Error while checking import data')
        console.log(err)
        if (err instanceof SyntaxError) {
          setCheckImportErrorText(`Invalid JSON syntax`)
        } else {
          setCheckImportErrorText((err as any).message as string)
        }
      } finally {
        setIsCheckingImportedData(false)
        const databases = await Dexie.getDatabaseNames()
        if (databases.includes(tempDbName)) {
          console.log(`Deleting ${tempDbName}`)
          await Dexie.delete(tempDbName)
        }
      }
    }
    checkImportContent()
  }, [importedContent])

  return (
    <div className="flex w-full pl-10 flex-col fixed inset-y-0 items-center bg-yellow-100 opacity-80">
      <div className="h-20 flex items-center justify-center text-3xl">
        Import Export
      </div>
      <div className="m-5">Current DB Schema Version: {db.verno}</div>
      <div className="h-20 flex items-center justify-center text-xl">
        Export
      </div>
      <div className="h-10">
        {!isExportReady && (
          <button
            className="border hover:bg-yellow-200"
            onClick={onClickPrepareExport}
          >
            Prepare Export
          </button>
        )}
        {isExportReady && (
          <button className="border">
            <a
              className="block hover:bg-yellow-200"
              href={fileContentString}
              download={fileName}
            >
              Export
            </a>
          </button>
        )}
      </div>
      <div className="h-20 flex items-center justify-center text-xl">
        Import
      </div>
      <div className="flex justify-center cursor-pointer items-center h-20 w-full my-10 border-dashed border-2 hover:bg-yellow-200">
        {!isCheckingImportedData && (
          <MyDropzone setImportedContent={setImportedContent} />
        )}
      </div>
      <div
        className={classNames(
          isImportReady ? 'cursor-pointer' : 'text-gray-400 cursor-not-allowed',
          'border hover:bg-yellow-200'
        )}
        onClick={onClickImport}
      >
        Import
      </div>
      <div>{checkImportErrorText}</div>
      {wasImportSuccessful && (
        <div
          className="text-xl text-green-600 m-5 cursor-pointer hover:bg-yellow-200 border"
          onClick={() => window.location.reload()}
        >
          Import was successful! Click to reload app now.
        </div>
      )}
    </div>
  )
}
