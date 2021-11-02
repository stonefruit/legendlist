import {
  HomeIcon,
  AcademicCapIcon,
  FolderIcon,
  InboxInIcon,
} from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import SideBar from './SideBar'
import TaskView from './TaskView'
import MiniSideBar from './MiniSideBar'
import { NavigationItem } from '../types'
import * as models from '../models'

const assignIcons = (navigation: NavigationItem[]) => {
  return navigation.map((nav) => {
    if (nav.id === 'HOME') {
      nav.icon = HomeIcon
    } else if (nav.id === 'COMPLETED') {
      nav.icon = AcademicCapIcon
    } else if (nav.id === 'INBOX') {
      nav.icon = InboxInIcon
    } else {
      nav.icon = FolderIcon
    }
    return { ...nav }
  })
}

export default function Shell() {
  const [navigation, setNavigation] = useState<NavigationItem[]>([])
  const [shouldRefresh, setShouldRefresh] = useState(true)

  const onClickAddFolder = async () => {
    await models.Folder.create({ name: 'New Folder' })
    setShouldRefresh(true)
  }

  const onClickDeleteFolder = async (id: string) => {
    await models.Folder.destroy({ id })
    setShouldRefresh(true)
  }

  useEffect(() => {}, [])

  useEffect(() => {
    if (shouldRefresh) {
      const runAsync = async () => {
        const _folders = await models.Folder.find()
        const allFolders = _folders.map((folder): NavigationItem => {
          return {
            id: folder.id,
            name: folder.name,
            current: false,
          }
        })
        const navigationWithIcons = allFolders.map((nav) => {
          nav.icon = nav.icon || FolderIcon
          return nav
        })
        setNavigation(navigationWithIcons)
      }
      runAsync()
      setShouldRefresh(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRefresh])

  const navCurrentIndex = navigation.findIndex((navigator) => navigator.current)
  const navIndex = navCurrentIndex > -1 ? navCurrentIndex : 0

  const changeCurrentNavigation = (id: string) => {
    const selectedNavigatorIndex = navigation.findIndex(
      (navigator) => navigator.id === id
    )
    let newNavigation: NavigationItem[] = JSON.parse(JSON.stringify(navigation))
    if (selectedNavigatorIndex >= 0) {
      newNavigation = newNavigation.map((navigator) => {
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

  const navigationWithIcons = assignIcons(navigation)

  if (navigation.length === 0) {
    return null
  }

  return (
    <div className="bg-yellow-50 h-screen">
      <MiniSideBar navigation={navigation} />
      <SideBar
        navigation={navigation}
        changeCurrentNavigation={changeCurrentNavigation}
        onClickAddFolder={onClickAddFolder}
        selectedNavId={navigationWithIcons[navIndex].id}
      />
      <TaskView
        navigator={navigationWithIcons[navIndex]}
        selectedNavId={navigationWithIcons[navIndex].id}
        onClickDeleteFolder={onClickDeleteFolder}
      />
    </div>
  )
}
