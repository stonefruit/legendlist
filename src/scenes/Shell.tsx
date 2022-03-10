import { useEffect, useState } from 'react'
import {
  HomeIcon,
  AcademicCapIcon,
  FolderIcon,
  InboxInIcon,
} from '@heroicons/react/outline'
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'
import hillBackground from '../assets/hillBackground'
import * as models from '../models'
import { Activity, NavigationItem } from '../types'
import ImportExport from './ImportExport'
import MiniSideBar from './MiniSideBar'
import SideBar from './SideBar'
import TaskView from './TaskView'
import Search from './Search/Search'
import Files from './Files'

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
  const [navIndex, setNavIndex] = useState<number | 'NEXT_3_DAYS'>(
    'NEXT_3_DAYS'
  )
  const [activity, setActivity] = useState<Activity>('TASK')

  const navigationWithIcons = assignIcons(navigation)

  // FUNCTIONS

  const onClickAddFolder = () => {
    const now = Date.now()
    const newFolder = {
      id: uuidv4(),
      name: 'New Folder',
      createdAt: now,
      modifiedAt: now,
    }
    models.Folder.create(newFolder)
    const allFolders = _.cloneDeep(navigation)
    allFolders.push(newFolder)
    setNavigation(allFolders)
  }
  const onClickArchiveFolder = (id: string) => {
    const allFolders = _.cloneDeep(navigation)
    const selectedFolderIndex = allFolders.findIndex(
      (folder) => folder.id === id
    )
    if (allFolders[selectedFolderIndex].archivedAt) {
      allFolders[selectedFolderIndex].archivedAt = null
    } else {
      allFolders[selectedFolderIndex].archivedAt = Date.now()
    }
    models.Folder.archive({
      id,
      archivedAt: allFolders[selectedFolderIndex].archivedAt,
    })
    const newIndex = allFolders.findIndex((navigator) => navigator.id === id)
    setNavigation(allFolders)
    if (allFolders[selectedFolderIndex].archivedAt) {
      setNavIndex(0)
    } else {
      setNavIndex(newIndex)
    }
  }
  const updateFolder = ({ id, name }: { id: string; name?: string }) => {
    const allFolders = _.cloneDeep(navigation)
    const selectedFolderIndex = allFolders.findIndex(
      (folder) => folder.id === id
    )
    allFolders[selectedFolderIndex] = {
      ...allFolders[selectedFolderIndex],
      id,
      name: name ?? '',
    }
    models.Folder.update({ id, name })
    setNavigation(allFolders)
  }

  const changeCurrentNavigation = (id: string) => {
    if (id === 'NEXT_3_DAYS') {
      setNavIndex('NEXT_3_DAYS')
    } else {
      const newIndex = navigation.findIndex((navigator) => navigator.id === id)
      const newNavIndex = newIndex > -1 ? newIndex : 0
      setNavIndex(newNavIndex)
    }
  }

  // EFFECTS

  useEffect(() => {
    if (activity === 'TASK') {
      const runAsync = async () => {
        const _folders = await models.Folder.find({})
        const allFolders = _folders.map((folder): NavigationItem => {
          return {
            id: folder.id,
            name: folder.name,
            archivedAt: folder.archivedAt,
          }
        })
        setNavigation(allFolders)
      }
      runAsync()
    }
  }, [activity])

  if (navigation.length === 0) {
    return null
  }

  const navigator =
    navIndex === 'NEXT_3_DAYS'
      ? { id: 'NEXT_3_DAYS', name: 'Next 3 Days' }
      : navigationWithIcons[navIndex]

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
          selectedNavId={navigator.id}
          updateFolder={updateFolder}
        />
      )}
      {activity === 'TASK' && (
        <TaskView
          navigator={navigator}
          selectedNavId={navigator.id}
          onClickArchiveFolder={onClickArchiveFolder}
          navigation={navigation}
        />
      )}
      {activity === 'SEARCH' && <Search navigation={navigation} />}
      {activity === 'IMPORT/EXPORT' && <ImportExport />}
      {activity === 'FILES' && <Files />}
    </div>
  )
}
