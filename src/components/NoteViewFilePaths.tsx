// TODO: Add state testing
import { useEffect, useState } from 'react'
import { MinusIcon, PlusIcon, XIcon } from '@heroicons/react/outline'
import { Task, UpdateTask } from '../types'
import { classNames } from '../utils'

type Props = {
  task: Task
  updateTask?: UpdateTask
}
export default function AddFilePath({ updateTask, task }: Props) {
  const [showInput, setShowInput] = useState(false)
  const [filePaths, setFilePaths] = useState<string[]>([])
  const [newFilePath, setNewFilePath] = useState('')
  const [prevTaskId, setPrevTaskId] = useState<string | null>(null)

  // Functions

  const onClickRemove = (filePathIndex: number) => {
    const updatedFilePaths = [...filePaths]
    updatedFilePaths.splice(filePathIndex, 1)
    setFilePaths(updatedFilePaths)
  }

  const onChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFilePath(e.target.value)
  }

  const onKeyUp = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const updatedFilePaths = [...filePaths]
      updatedFilePaths.unshift(newFilePath)
      setFilePaths(updatedFilePaths)
      setNewFilePath('')
      setShowInput(false)
    }
  }

  // Effects

  useEffect(() => {
    if (task.id !== prevTaskId) {
      const currentFilePaths = task.filePaths || []
      setFilePaths(currentFilePaths)
      setPrevTaskId(task.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevTaskId, task.id])

  const filePathsString = JSON.stringify(filePaths)
  useEffect(() => {
    if (!updateTask) {
      return
    }
    const taskFilePathsString = JSON.stringify(task?.filePaths)
    const taskContentChanged = taskFilePathsString !== filePathsString
    if (prevTaskId === task.id && taskContentChanged) {
      updateTask({ id: task.id, filePaths })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filePathsString])

  return (
    <div className="px-5">
      <div className="flex items-center">
        <div
          className={classNames(filePaths.length > 0 ? '' : 'text-gray-500')}
        >
          File Paths
        </div>
        {updateTask && (
          <div
            onClick={() => setShowInput(!showInput)}
            className="h-4 w-4 border rounded-lg bg-white hover:bg-gray-200 ml-2 cursor-pointer"
          >
            {!showInput && <PlusIcon className="w-full h-full" />}
            {showInput && <MinusIcon className="w-full h-full" />}
          </div>
        )}
      </div>
      {showInput && (
        <div>
          <input
            autoFocus
            autoComplete="off"
            value={newFilePath}
            onChange={onChangeContent}
            id="search-field"
            className="text-sm block bg-gray-100 w-full h-full pr-3 py-2 border-transparent focus:text-gray-900 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-0 focus:border-transparent"
            placeholder="Add File Path. Press Enter to save."
            type="addTask"
            name="addTask"
            onKeyUp={onKeyUp}
          />
        </div>
      )}
      <div className="max-h-40 overflow-auto mt-1">
        {filePaths.map((filePath, index) => (
          <div
            key={index}
            className={classNames(
              updateTask ? '' : 'ml-5',
              'flex items-center'
            )}
          >
            {updateTask && (
              <div
                className="h-4 w-4 border rounded-lg bg-white hover:bg-gray-200 mr-1 cursor-pointer"
                onClick={() => onClickRemove(index)}
              >
                <XIcon className="w-full h-full" />
              </div>
            )}
            <div>{filePath}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
