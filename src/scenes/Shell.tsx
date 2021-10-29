import { HomeIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import SideBar from './SideBar'
import TaskView from './TaskView'
import MiniSideBar from './MiniSideBar'
import NoteView from './NoteView'

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
      <div className="flex flex-row">
        <TaskView navigation={navigation} navIndex={navIndex} />
        <NoteView />
      </div>
    </div>
  )
}
