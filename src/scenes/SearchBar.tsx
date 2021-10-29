import { PlusIcon } from '@heroicons/react/solid'

function SearchBar() {
  return (
    <div className="flex h-16 bg-white shadow w-full mx-5">
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex">
          <div className="relative w-full text-yellow-500 focus-within:text-gray-600">
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
              <PlusIcon className="h-5 w-5" aria-hidden="true" />
            </div>
            <input
              id="search-field"
              className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
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

export default SearchBar
