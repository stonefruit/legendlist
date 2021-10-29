import { PlusIcon } from '@heroicons/react/solid'
import { useState } from 'react'
import { classNames } from '../utils'

type Props = {
  addTask(task: { name: string }): Promise<void>
}
function AddTaskBar({ addTask }: Props) {
  const [name, setName] = useState('')

  const validateAndAddTask = async () => {
    if (name) {
      await addTask({ name })
      setName('')
    }
  }

  const onClickAddTask = async () => {
    await validateAndAddTask()
  }

  const onChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const onKeyUp = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await validateAndAddTask()
    }
  }

  return (
    <div className="flex mt-2 h-9 bg-gray-100 border border-opacity-0 focus-within:border-opacity-100 border-gray-200 focus-within:border-yellow-500 mx-5 rounded-lg">
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex">
          <div className="relative w-full text-gray-400 focus-within:text-gray-300">
            <div
              onClick={onClickAddTask}
              className={classNames(
                name && 'cursor-pointer',
                'absolute inset-y-0 left-0 flex items-center'
              )}
            >
              <PlusIcon
                className={classNames(
                  name && 'text-yellow-500 hover:text-yellow-600',
                  'h-4 w-4'
                )}
                aria-hidden="true"
              />
            </div>
            <input
              value={name}
              onChange={onChangeContent}
              id="search-field"
              className="text-sm block bg-gray-100 w-full h-full pl-6 pr-3 py-2 border-transparent focus:text-gray-900 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-0 focus:border-transparent"
              placeholder="Add Task. Press Enter to save."
              type="addTask"
              name="addTask"
              onKeyUp={onKeyUp}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddTaskBar
