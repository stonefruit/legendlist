// TODO: Add state testing
import { useState } from 'react'
import { SearchIcon } from '@heroicons/react/outline'
import { classNames } from '../../utils'

type Props = {
  search(searchParams: { searchText: string }): Promise<void>
}
function SearchBar({ search }: Props) {
  const [searchText, setSearchText] = useState('')

  // FUNCTIONS

  const onClickAddTask = async () => {
    await search({ searchText })
  }

  const onChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
  }

  const onKeyUp = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await search({ searchText })
    }
  }

  return (
    <div className="max-w-2xl flex mt-2 h-9 bg-gray-100 border border-opacity-0 focus-within:border-opacity-100 border-gray-200 focus-within:border-yellow-500 mx-5 rounded-lg">
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex">
          <div className="relative w-full text-gray-400 focus-within:text-gray-300">
            <input
              value={searchText}
              onChange={onChangeContent}
              id="new-task-text-field"
              className="text-sm block bg-gray-100 w-full h-full pl-3 pr-6 py-2 border-transparent focus:text-gray-900 placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-0 focus:border-transparent"
              placeholder="Add Task. Press Enter to save."
              type="addTask"
              name="addTask"
              onKeyUp={onKeyUp}
            />
            <div
              id="add-button"
              onClick={onClickAddTask}
              className={classNames(
                searchText && 'cursor-pointer',
                'absolute inset-y-0 right-0 flex items-center'
              )}
            >
              <SearchIcon
                className={classNames(
                  searchText && 'text-yellow-500 hover:text-yellow-600',
                  'h-4 w-4'
                )}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
