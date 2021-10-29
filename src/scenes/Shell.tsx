import { HomeIcon, AcademicCapIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import SideBar from './SideBar'
import TaskView from './TaskView'
import MiniSideBar from './MiniSideBar'
import { NavigationItem } from '../types'

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
    setNavigation(newNavigation)
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
