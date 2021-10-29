import { NavigationItem } from '../types'
import { classNames } from '../utils'
import legendlistLogo from '../assets/legendlistLogo.svg'

type Props = {
  navigation: NavigationItem[]
}
export default function SideBar({ navigation }: Props) {
  return (
    <div className="flex w-64 pl-10 flex-col fixed inset-y-0 text-yellow-500 border-r border-yellow-200">
      <div className="flex flex-col flex-grow pt-5 bg-yellow-100 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mx-auto">
          <img className="h-12 w-auto" src={legendlistLogo} alt="Workflow" />
        </div>
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                className={classNames(
                  item.current
                    ? 'bg-yellow-500 text-white cursor-default'
                    : 'text-yellow-500 hover:bg-yellow-200 cursor-pointer',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                )}
              >
                <item.icon
                  className={classNames(
                    item.current ? 'text-white' : 'text-yellow-500',
                    'mr-3 flex-shrink-0 h-6 w-6'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
