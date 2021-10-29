import { NavigationItem } from '../types'
import SearchBar from './SearchBar'
import TaskList from './TaskList.'

type Props = {
  navigation: NavigationItem[]
  navIndex: number
}
export default function MainView({ navigation, navIndex }: Props) {
  return (
    <div className="pl-64 flex flex-col flex-1">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            {navigation[navIndex]?.name}
          </h1>
        </div>
        <SearchBar />
        <div className="max-w-7xl mx-auto px-8">
          <TaskList />
        </div>
      </div>
    </div>
  )
}
