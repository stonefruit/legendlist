import { useEffect, useState } from 'react'
import Select from 'react-select'
import { Descendant } from 'slate'
import RichTextEditor from '../components/RichTextEditor'
import { NavigationItem, Task } from '../types'
import * as models from '../models'
import NoteViewFilePaths from './NoteViewFilePaths'

type Props = {
  task: Task | null
  navigation: NavigationItem[]
  updateTask({
    id,
    actualEndDate,
    name,
    folderId,
    filePaths,
  }: {
    id: string
    actualEndDate?: number | null
    name?: string
    folderId?: string
    filePaths?: string[]
  }): Promise<void>
}
const initialData = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]
export default function NoteView({ task, navigation, updateTask }: Props) {
  const [value, setValue] = useState<Descendant[]>(initialData)
  const [shouldRefreshEditor, setShouldRefreshEditor] = useState(false)

  const folderOptions = navigation.map((nav) => {
    return {
      value: nav.id,
      label: nav.name,
    }
  })
  const currentFolder = navigation.find((nav) => nav.id === task?.folderId)

  // EFFECTS

  useEffect(() => {
    setShouldRefreshEditor(true)
    if (task && task.content && task.content.length > 0) {
      setValue(task.content)
    } else {
      setValue(initialData)
    }
  }, [task])

  useEffect(() => {
    if (shouldRefreshEditor) {
      setShouldRefreshEditor(false)
    }
  }, [shouldRefreshEditor])

  useEffect(() => {
    const runAsync = async () => {
      if (task) {
        await models.Task.update({ id: task.id, content: value })
      }
    }
    runAsync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className="flex flex-col flex-1 w-64 border-l h-screen justify-center overflow-y-hidden">
      {!task && (
        <div className="flex justify-center">Task Notes will appear here</div>
      )}
      {task && (
        <div className="h-screen flex flex-1 flex-col">
          <div className="h-20 flex flex-col align-middle justify-center mx-auto">
            <div className="flex items-center justify-center text-center text-xl p-5">
              {task.name}
            </div>
          </div>
          <div className="h-auto overflow-y-auto flex flex-1 flex-col border-t pr-5 pl-5 pb-5">
            {!shouldRefreshEditor && (
              <RichTextEditor value={value} setValue={setValue} />
            )}
          </div>
          <NoteViewFilePaths updateTask={updateTask} task={task} />
          <div className="flex flex-col align-middle justify-center p-3">
            <div className="w-1/2 cursor-pointer">
              <Select
                onChange={(value) => {
                  updateTask({ id: task.id, folderId: value!.value })
                }}
                options={folderOptions}
                menuPlacement="top"
                maxMenuHeight={200}
                value={{
                  value: task.folderId,
                  label: currentFolder?.name,
                }}
                isSearchable={false}
                isClearable={false}
                className="text-xs w-32 ring-0"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    height: 20,
                    border: 0,
                    boxShadow: '0',
                    backgroundColor:
                      'rgba(255, 251, 235, var(--tw-bg-opacity))',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor:
                        'rgba(254, 243, 199, var(--tw-bg-opacity))',
                    },
                  }),
                  dropdownIndicator: (provided, state) => ({
                    ...provided,
                    display: 'none',
                  }),
                  indicatorSeparator: (provided, state) => ({
                    ...provided,
                    display: 'none',
                  }),
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
