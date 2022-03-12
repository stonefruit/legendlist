import Fuse from 'fuse.js'
import { useState } from 'react'
import SearchBar from './SearchBar'
import NoteView from '../NoteView'
import TaskListItem from '../TaskView/TaskListItem'
import * as models from '../../models'
import { NavigationItem, Task } from '../../types'

// TODO: Move as helper and add tests
const getTextFromRichText = (content: any[]): string => {
  if (!Array.isArray(content)) {
    return ''
  }
  const textArray: string[] = []
  content.forEach((line) => {
    if (Array.isArray(line?.children)) {
      line.children.forEach((partialTextObj: any) => {
        if (partialTextObj?.text) {
          textArray.push(partialTextObj.text)
        }
      })
    }
    textArray.push(' ')
  })
  const text = textArray.join('')
  return text
}

type Props = {
  navigation: NavigationItem[]
}
export default function Search({ navigation }: Props) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [currentSearchText, setCurrentSearchText] = useState('')

  const activeTask = tasks.find((task) => task.id === activeTaskId) || null

  const search = async ({ searchText }: { searchText: string }) => {
    const dbTasks: (Task & {
      contentString?: string
      filePathsString?: string
    })[] = await models.Task.find({})
    dbTasks.forEach((task) => {
      task.contentString = getTextFromRichText(task.content)
      task.filePathsString = task.filePaths ? task.filePaths.join(' ') : ''
    })
    const fuse = new Fuse(dbTasks, {
      keys: [
        {
          name: 'name',
          weight: 0.6,
        },
        {
          name: 'contentString',
          weight: 0.4,
        },
        {
          name: 'filePathsString',
          weight: 0.4,
        },
      ],
    })
    const fuseResults = fuse.search(searchText)
    const searchResults = fuseResults.map((result) => {
      return { ...result.item }
    })
    setCurrentSearchText(searchText)
    setTasks(searchResults)
  }

  const selectActiveTask = (id: string | null) => {
    setActiveTaskId(id)
  }

  return (
    <div className="ml-10 flex flex-row bg-yellow-50 opacity-90">
      <div className="flex flex-col flex-1 h-screen overflow-y-auto">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Search</h1>{' '}
          </div>
          <SearchBar search={search} />
          {currentSearchText && (
            <div className="text-xs ml-6 mt-2">
              {tasks.length}&nbsp;
              {tasks.length === 1 ? 'result' : 'results'} found for "
              {currentSearchText}".
            </div>
          )}
          <div className="mx-auto">
            <div className="py-4">
              {tasks.map((task, index) => {
                return (
                  <div key={task.id}>
                    <TaskListItem
                      key={task.id}
                      task={task}
                      isTopOfList={index === 0}
                      isBottomOfList={tasks.length - 1 === index}
                      activeTaskId={activeTaskId}
                      selectActiveTask={selectActiveTask}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <NoteView task={activeTask} navigation={navigation} />
    </div>
  )
}
