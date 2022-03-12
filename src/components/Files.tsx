import { useEffect, useState } from 'react'
import * as models from '../models'

export default function Files() {
  const [files, setFiles] = useState<string[]>([])

  useEffect(() => {
    const runAsync = async () => {
      const dbTasks = await models.Task.find({})
      const dbFilePaths: string[] = []
      dbTasks.forEach((task) => {
        if (task.filePaths) {
          task.filePaths.forEach((filePath) => dbFilePaths.push(filePath))
        }
      })
      dbFilePaths.sort()
      setFiles(dbFilePaths)
    }
    runAsync()
  }, [])

  return (
    <div className="flex w-full pl-10 flex-col fixed inset-y-0 items-center bg-yellow-100 opacity-80">
      <div className="h-20 flex items-center justify-center text-3xl">
        Files
      </div>
      <div className="mx-10">
        {files.map((filePath) => {
          return <div className="mb-1 border-b border-gray-400">{filePath}</div>
        })}
      </div>
    </div>
  )
}
