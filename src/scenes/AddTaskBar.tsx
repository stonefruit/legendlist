import { PlusIcon } from '@heroicons/react/solid'
import { useState } from 'react'
import { classNames } from '../utils'

type Props = {
  addTask(task: { name: string }): Promise<void>
}
function AddTaskBar({ addTask }: Props) {
  const [name, setName] = useState('')

  const onClickAddTask = async () => {
    if (name) {
      await addTask({ name })
      setName('')
    }
  }

  const onChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  return (
    <div className="flex mt-2 h-12 bg-white shadow border border-gray-200 focus-within:border-yellow-500 mx-5 rounded-lg">
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
                className={classNames(name && 'text-yellow-500', 'h-5 w-5')}
                aria-hidden="true"
              />
            </div>
            <input
              value={name}
              onChange={onChangeContent}
              id="search-field"
              className="block w-full h-full pl-8 pr-3 py-2 border-transparent focus:text-gray-900 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-0 focus:border-transparent sm:text-sm"
              placeholder="Add Task"
              type="addTask"
              name="addTask"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddTaskBar
