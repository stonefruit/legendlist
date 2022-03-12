// TODO: Add state testing
import { useState } from 'react'
import { PlusIcon, CalendarIcon } from '@heroicons/react/solid'
import LegendListLogo from '../assets/LegendListLogo'
import { NavigationItem } from '../types'
import { classNames } from '../utils'

type Props = {
  navigation: NavigationItem[]
  changeCurrentNavigation(id: string): void
  onClickAddFolder(): void
  selectedNavId: string
  updateFolder({ id, name }: { id: string; name?: string }): void
}
export default function SideBar({
  navigation,
  changeCurrentNavigation,
  onClickAddFolder,
  selectedNavId,
  updateFolder,
}: Props) {
  const [showArchived, setShowArchived] = useState(false)
  // FUNCTIONS
  const onClickNavigator = (id: string) => () => {
    changeCurrentNavigation(id)
  }

  const onChangeName = async (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFolder({ id: selectedNavId, name: e.target.value })
  }

  const isNext3DaysFilter = 'NEXT_3_DAYS' === selectedNavId

  const unarchivedNavigation = navigation.filter((nav) => !nav.archivedAt)
  const archivedNavigation = navigation
    .filter((nav) => nav.archivedAt)
    .sort((a, b) => {
      if (!a.archivedAt || !b.archivedAt || a.archivedAt === b.archivedAt) {
        return 0
      }
      return a.archivedAt < b.archivedAt
        ? 1
        : a.archivedAt > b.archivedAt
        ? -1
        : 0
    })

  return (
    <div className="flex w-64 pl-10 flex-col fixed z-30 inset-y-0 text-yellow-500 border-r border-yellow-200 opacity-80">
      <div className="flex flex-col flex-grow pt-5 bg-yellow-100 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mx-auto">
          <LegendListLogo height={80} />
        </div>
        <div className="mt-5 flex-1 flex flex-col">
          <div className="flex justify-between px-2 pb-4 items-center">
            <div>Filters</div>
          </div>
          <nav className="px-2 pb-4 space-y-1">
            <div
              key={'NEXT_3_DAYS'}
              onClick={onClickNavigator('NEXT_3_DAYS')}
              className={classNames(
                isNext3DaysFilter
                  ? 'bg-yellow-500 text-white cursor-default'
                  : 'text-yellow-500 hover:bg-yellow-200 cursor-pointer',
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
              )}
            >
              <CalendarIcon
                className={classNames(
                  isNext3DaysFilter ? 'text-white' : 'text-yellow-500',
                  'mr-3 flex-shrink-0 h-6 w-6'
                )}
                aria-hidden="true"
              />
              <input
                disabled
                type="text"
                className={classNames(
                  isNext3DaysFilter
                    ? 'bg-yellow-500 group-hover:bg-yellow-500 text-white'
                    : 'group-hover:bg-yellow-200 text-yellow-500 bg-yellow-100 cursor-pointer',
                  ' placeholder-gray-400 pr-6 break-words border-0 bg-yellow-50 p-0 m-0 focus:ring-transparent w-full resize-none outline-none'
                )}
                placeholder="What would you like to call this item?"
                onChange={onChangeName}
                value={'Next 3 Days'}
              />
            </div>
          </nav>
          <div className="flex justify-between px-2 pb-4 items-center">
            <div>Folders</div>
            <button
              onClick={onClickAddFolder}
              className="bg-yellow-200 rounded-md p-1 border border-yellow-400 cursor-pointer hover:bg-yellow-100 active:bg-white h-6 w-6 outline-none"
            >
              <PlusIcon className="h-full w-full" />
            </button>
          </div>
          <nav className="px-2 pb-4 space-y-1">
            {unarchivedNavigation.map((item) => (
              <div
                key={item.id}
                onClick={onClickNavigator(item.id)}
                className={classNames(
                  item.id === selectedNavId
                    ? 'bg-yellow-500 text-white cursor-default'
                    : 'text-yellow-500 hover:bg-yellow-200 cursor-pointer',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                )}
              >
                {item.icon && (
                  <item.icon
                    className={classNames(
                      item.id === selectedNavId
                        ? 'text-white'
                        : 'text-yellow-500',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                )}
                {!item.icon && <div className="mr-3 flex-shrink-0 h-6 w-6" />}
                <input
                  disabled={item.id !== selectedNavId}
                  type="text"
                  className={classNames(
                    item.id === selectedNavId
                      ? 'bg-yellow-500 group-hover:bg-yellow-500 text-white cursor-text'
                      : 'group-hover:bg-yellow-200 text-yellow-500 bg-yellow-100 cursor-pointer',
                    ' placeholder-gray-400 pr-6 break-words border-0 bg-yellow-50 p-0 m-0 focus:ring-transparent w-full resize-none outline-none'
                  )}
                  placeholder="What would you like to call this item?"
                  onChange={onChangeName}
                  value={item.name}
                />
              </div>
            ))}
          </nav>

          <div className="flex justify-between px-2 pb-4 items-center">
            <div>Archived</div>
            <div
              className="text-xs cursor-pointer opacity-60 hover:opacity-100"
              onClick={() => setShowArchived(!showArchived)}
            >
              {showArchived ? 'hide' : 'show'}
            </div>
          </div>
          <nav className="px-2 pb-4 space-y-1">
            {showArchived &&
              archivedNavigation.map((item) => (
                <div
                  key={item.id}
                  onClick={onClickNavigator(item.id)}
                  className={classNames(
                    item.id === selectedNavId
                      ? 'bg-yellow-500 text-white cursor-default'
                      : 'text-yellow-500 hover:bg-yellow-200 cursor-pointer',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  {item.icon && (
                    <item.icon
                      className={classNames(
                        item.id === selectedNavId
                          ? 'text-white'
                          : 'text-yellow-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                  )}
                  {!item.icon && <div className="mr-3 flex-shrink-0 h-6 w-6" />}
                  <input
                    disabled={item.id !== selectedNavId}
                    type="text"
                    className={classNames(
                      item.id === selectedNavId
                        ? 'bg-yellow-500 group-hover:bg-yellow-500 text-white cursor-text'
                        : 'group-hover:bg-yellow-200 text-yellow-500 bg-yellow-100 cursor-pointer',
                      ' placeholder-gray-400 pr-6 break-words border-0 bg-yellow-50 p-0 m-0 focus:ring-transparent w-full resize-none outline-none'
                    )}
                    placeholder="What would you like to call this item?"
                    onChange={onChangeName}
                    value={item.name}
                  />
                </div>
              ))}
          </nav>
        </div>
        <div className="text-xs flex items-center justify-center text-gray-400 mb-2">
          __BUILD__
        </div>
      </div>
    </div>
  )
}
