import { HomeIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import SideBar from './SideBar'
import MainView from './MainView'
import MiniSideBar from './MiniSideBar'

export const navigation = [
  { name: 'Home', href: '#', icon: HomeIcon, current: true },
  { name: 'Home', href: '#', icon: HomeIcon, current: false },
]

export default function Example() {
  const [navIndex] = useState(0)
  return (
    <div>
      <MiniSideBar navigation={navigation} />
      <SideBar navigation={navigation} />
      <MainView navigation={navigation} navIndex={navIndex} />
    </div>
  )
}
