import { HomeIcon, AcademicCapIcon, FolderIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import SideBar from './SideBar'
import TaskView from './TaskView'
import MiniSideBar from './MiniSideBar'
import { NavigationItem } from '../types'
import * as models from '../models'

// Always start at Home
const defaultNavigators = [
  { id: 'HOME', name: 'Home', icon: HomeIcon, current: true },
  { id: 'COMPLETED', name: 'Completed', icon: AcademicCapIcon, current: false },
  { id: 'BOO', name: 'Boo', current: false },
]

export default function Shell() {
  const [navigation, setNavigation] = useState<NavigationItem[]>([
    ...defaultNavigators,
  ])

  useEffect(() => {
    const runAsync = async () => {
      const _folders = await models.Folder.find()
      const newFolders = _folders.map((folder) => {
        return {
          id: folder.id,
          name: folder.name,
          current: false,
          icon: undefined,
        }
      })
      const navigationWithIcons = [...newFolders, ...navigation].map((nav) => {
        nav.icon = nav.icon || FolderIcon
        return nav
      })
      setNavigation(navigationWithIcons)
    }
    runAsync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const navIndex = navigation.findIndex((navigator) => navigator.current)

  const changeCurrentNavigation = (id: string) => {
    const selectedNavigatorIndex = navigation.findIndex(
      (navigator) => navigator.id === id
    )
    let newNavigation: NavigationItem[] = JSON.parse(JSON.stringify(navigation))
    if (selectedNavigatorIndex >= 0) {
      newNavigation = newNavigation.map((navigator) => {
        if (navigator.id === 'HOME') {
          navigator.icon = HomeIcon
        }
        if (navigator.id === 'COMPLETED') {
          navigator.icon = AcademicCapIcon
        }
        if (navigator.id === id) {
          navigator.current = true
        } else {
          navigator.current = false
        }
        return navigator
      })
    } else {
      newNavigation = newNavigation.map((navigator) => {
        if (navigator.id === 'HOME') {
          navigator.current = true
          navigator.icon = HomeIcon
        } else {
          navigator.current = false
        }
        return navigator
      })
    }
    const navigationWithIcons = newNavigation.map((nav) => {
      nav.icon = nav.icon || FolderIcon
      return nav
    })
    setNavigation(navigationWithIcons)
  }

  return (
    <div className="bg-yellow-50 h-screen">
      <MiniSideBar navigation={navigation} />
      <SideBar
        navigation={navigation}
        changeCurrentNavigation={changeCurrentNavigation}
      />
      <TaskView navigation={navigation} navIndex={navIndex} />
    </div>
  )
}
