import { HomeIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import SideBar from './SideBar'
import TaskView from './TaskView'
import MiniSideBar from './MiniSideBar'

export const navigation = [
  { name: 'Home', href: '#', icon: HomeIcon, current: true },
  { name: 'Home2', href: '#', icon: HomeIcon, current: false },
]

export default function Example() {
  const [navIndex] = useState(0)
  return (
    <div className="bg-yellow-50 h-screen">
      <MiniSideBar navigation={navigation} />
      <SideBar navigation={navigation} />
      <TaskView navigation={navigation} navIndex={navIndex} />
    </div>
  )
}
