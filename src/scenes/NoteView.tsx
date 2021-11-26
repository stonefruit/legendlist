import { useEffect, useState } from 'react'
import Select from 'react-select'
import { Descendant } from 'slate'
import RichTextEditor from '../components/RichTextEditor'
import { NavigationItem, Task } from '../types'
import { classNames } from '../utils'
import NoteViewFilePaths from './NoteViewFilePaths'

type Props = {
  task: Task | null
  navigation: NavigationItem[]
  updateTask?: ({
    id,
    actualEndDate,
    name,
    folderId,
    filePaths,
    content,
  }: {
    id: string
    actualEndDate?: number | null
    name?: string
    folderId?: string
    filePaths?: string[]
    content?: Descendant[]
  }) => Promise<void>
}
const initialData = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]
export default function NoteView({ task, navigation, updateTask }: Props) {
  const [content, setContent] = useState<Descendant[]>(initialData)
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
      setContent(task.content)
    } else {
      setContent(initialData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.id])

  useEffect(() => {
    if (shouldRefreshEditor) {
      setShouldRefreshEditor(false)
    }
  }, [shouldRefreshEditor])

  const contentString = JSON.stringify(content)
  useEffect(() => {
    if (!updateTask) {
      return
    }
    const runAsync = async () => {
      const taskContentString = JSON.stringify(task?.content)
      const taskContentChanged = taskContentString !== contentString
      if (task && taskContentChanged) {
        console.log({ value: content, id: task.id })
        await updateTask({ id: task.id, content: content })
      }
    }
    runAsync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentString])

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
          <div
            className={classNames(
              updateTask ? '' : 'pt-5',
              'h-auto overflow-y-auto flex flex-1 flex-col border-t pr-5 pl-5 pb-5'
            )}
          >
            {!shouldRefreshEditor && (
              <RichTextEditor
                value={content}
                setValue={setContent}
                readOnly={!updateTask}
              />
            )}
          </div>
          <NoteViewFilePaths updateTask={updateTask} task={task} />
          <div className="flex flex-col align-middle justify-center p-3">
            <div
              className={classNames(
                updateTask ? 'cursor-pointer' : '',
                'w-1/2'
              )}
            >
              <Select
                isDisabled={!updateTask}
                onChange={(value) => {
                  if (!updateTask) {
                    return
                  }
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
