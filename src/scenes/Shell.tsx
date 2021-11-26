import { useEffect, useState } from 'react'
import {
  HomeIcon,
  AcademicCapIcon,
  FolderIcon,
  InboxInIcon,
} from '@heroicons/react/outline'
import hillBackground from '../assets/hillBackground'
import * as models from '../models'
import { Activity, NavigationItem } from '../types'
import ImportExport from './ImportExport'
import MiniSideBar from './MiniSideBar'
import SideBar from './SideBar'
import TaskView from './TaskView'
import Search from './Search/Search'

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
  const [navIndex, setNavIndex] = useState(0)
  const [activity, setActivity] = useState<Activity>('TASK')

  const navigationWithIcons = assignIcons(navigation)

  // FUNCTIONS

  const onClickAddFolder = async () => {
    await models.Folder.create({ name: 'New Folder' })
    setShouldRefresh(true)
  }
  const onClickDeleteFolder = async (id: string) => {
    await models.Folder.destroy({ id })
    setNavIndex(0)
    setShouldRefresh(true)
  }
  const changeCurrentNavigation = (id: string) => {
    const newIndex = navigation.findIndex((navigator) => navigator.id === id)
    const newNavIndex = newIndex > -1 ? newIndex : 0
    setNavIndex(newNavIndex)
  }

  const updateFolder = async ({ id, name }: { id: string; name?: string }) => {
    await models.Folder.update({ id, name })
    setShouldRefresh(true)
  }

  // EFFECTS

  useEffect(() => {
    if (shouldRefresh) {
      const runAsync = async () => {
        const _folders = await models.Folder.find()
        const allFolders = _folders.map((folder): NavigationItem => {
          return {
            id: folder.id,
            name: folder.name,
          }
        })
        setNavigation(allFolders)
      }
      runAsync()
      setShouldRefresh(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRefresh])

  if (navigation.length === 0) {
    return null
  }
  return (
    <div
      className="h-screen"
      style={{
        backgroundImage: `url(${hillBackground})`,
        backgroundSize: 'cover',
      }}
    >
      <MiniSideBar activity={activity} setActivity={setActivity} />
      {activity === 'TASK' && (
        <SideBar
          navigation={navigation}
          changeCurrentNavigation={changeCurrentNavigation}
          onClickAddFolder={onClickAddFolder}
          selectedNavId={navigationWithIcons[navIndex].id}
          updateFolder={updateFolder}
        />
      )}
      {activity === 'TASK' && (
        <TaskView
          navigator={navigationWithIcons[navIndex]}
          selectedNavId={navigationWithIcons[navIndex].id}
          onClickDeleteFolder={onClickDeleteFolder}
          navigation={navigation}
        />
      )}
      {activity === 'SEARCH' && <Search navigation={navigation} />}
      {activity === 'IMPORT/EXPORT' && <ImportExport />}
    </div>
  )
}
