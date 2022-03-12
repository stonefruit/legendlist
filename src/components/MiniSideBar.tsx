// TODO: Add state testing
import { SearchIcon, FolderIcon } from '@heroicons/react/outline'
import {
  BellIcon,
  BadgeCheckIcon,
  DocumentDownloadIcon,
} from '@heroicons/react/solid'
import { Activity } from '../types'
import { classNames } from '../utils'

type Props = {
  activity: Activity
  setActivity: React.Dispatch<React.SetStateAction<Activity>>
}
export default function MiniSideBar({ activity, setActivity }: Props) {
  return (
    <div className="flex w-10 flex-col fixed inset-y-0 z-40 opacity-90">
      <div className="flex flex-col flex-grow bg-yellow-500 overflow-y-auto">
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex pb-4 space-y-1 flex-col justify-between h-full">
            <div>
              <div
                className={classNames(
                  activity === 'TASK' ? 'bg-yellow-800' : '',
                  'mx-auto h-6 py-5 w-full flex items-center justify-center cursor-pointer hover:bg-yellow-800'
                )}
                onClick={() => setActivity('TASK')}
              >
                <BadgeCheckIcon className="h-6 w-6" color="white" />
              </div>

              <div
                className={classNames(
                  activity === 'SEARCH' ? 'bg-yellow-800' : '',
                  'mx-auto h-6 py-5 w-full flex items-center justify-center cursor-pointer hover:bg-yellow-800'
                )}
                onClick={() => setActivity('SEARCH')}
              >
                <SearchIcon className="h-6 w-6" color="white" />
              </div>
              <div
                className={classNames(
                  activity === 'FILES' ? 'bg-yellow-800' : '',
                  'mx-auto h-6 py-5 w-full flex items-center justify-center cursor-pointer hover:bg-yellow-800'
                )}
                onClick={() => setActivity('FILES')}
              >
                <FolderIcon className="h-6 w-6" color="white" />
              </div>
              <div
                className={classNames(
                  activity === 'IMPORT/EXPORT' ? 'bg-yellow-800' : '',
                  'mx-auto h-6 py-5 w-full flex items-center justify-center cursor-pointer hover:bg-yellow-800'
                )}
                onClick={() => setActivity('IMPORT/EXPORT')}
              >
                <DocumentDownloadIcon className="h-6 w-6" color="white" />
              </div>
            </div>
            <div className="mx-auto h-6 w-6">
              <BellIcon className="h-6 w-6" color="white" />
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}
