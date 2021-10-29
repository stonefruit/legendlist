import { BellIcon, BadgeCheckIcon } from '@heroicons/react/solid'
import { NavigationItem } from '../types'

type Props = {
  navigation: NavigationItem[]
}
export default function MiniSideBar({ navigation }: Props) {
  return (
    <div className="flex w-10 flex-col fixed inset-y-0">
      <div className="flex flex-col flex-grow bg-yellow-500 overflow-y-auto">
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex px-2 pb-4 space-y-1 flex-col justify-between h-full">
            <div className="mx-auto h-6 w-6 h-full">
              <BadgeCheckIcon className="h-6 w-6" color="white" />
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
