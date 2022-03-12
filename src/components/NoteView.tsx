// TODO: Add state testing
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import Select from 'react-select'
import { Descendant } from 'slate'
import NoteViewFilePaths from './NoteViewFilePaths'
import RichTextEditor from './RichTextEditor'
import { NavigationItem, Task, UpdateTask } from '../types'
import { classNames } from '../utils'

type Props = {
  task: Task | null
  navigation: NavigationItem[]
  updateTask?: UpdateTask
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
      label: nav.archivedAt ? `[Archived] ${nav.name}` : nav.name,
    }
  })
  const currentFolder = navigation.find((nav) => nav.id === task?.folderId)

  const plannedStartDate = task?.plannedStartDate
    ? new Date(task.plannedStartDate)
    : null
  const plannedEndDate = task?.plannedEndDate
    ? new Date(task.plannedEndDate)
    : null

  const onChangeStartDate = (
    date: Date | [Date | null, Date | null] | null
  ) => {
    if (!task || !updateTask) {
      return
    }
    if (date instanceof Date) {
      updateTask({ id: task.id, plannedStartDate: +date })
      if (plannedEndDate && plannedEndDate < date) {
        updateTask({
          id: task.id,
          plannedEndDate: +date,
          plannedStartDate: +date,
        })
      }
    } else if (date === null) {
      updateTask({ id: task.id, plannedStartDate: null })
    }
  }

  const onChangeEndDate = (date: Date | [Date | null, Date | null] | null) => {
    if (!task || !updateTask) {
      return
    }
    if (date instanceof Date) {
      updateTask({ id: task.id, plannedEndDate: +date })
      if (plannedStartDate && plannedStartDate > date) {
        updateTask({
          id: task.id,
          plannedStartDate: +date,
          plannedEndDate: +date,
        })
      }
    } else if (date === null) {
      updateTask({ id: task.id, plannedStartDate: null, plannedEndDate: null })
    }
  }

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
        updateTask({ id: task.id, content: content })
      }
    }
    runAsync()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentString])

  const DatePickerWidget = () => {
    return (
      <div className="flex flex-col justify-center items-end my-2">
        <div className="flex">
          <div
            className={classNames(
              plannedEndDate ? '' : 'invisible',
              'flex items-center'
            )}
          >
            <div className="mr-2 text-xs">Start Date:</div>
            <div>
              <DatePicker
                selected={plannedStartDate}
                onChange={onChangeStartDate}
                selectsStart
                startDate={plannedStartDate}
                endDate={plannedStartDate ? plannedEndDate : null}
                dateFormat="dd MMM yyyy"
                className="w-36 h-6 rounded-md border-gray-200"
                disabled={!plannedEndDate || !updateTask}
                isClearable={!!updateTask}
              />
            </div>
          </div>
          <div className="flex items-center ml-6 mr-2">
            <div className="mr-2 text-xs">End Date:</div>
            <div>
              <DatePicker
                selected={plannedEndDate}
                onChange={onChangeEndDate}
                selectsEnd
                startDate={plannedStartDate}
                endDate={plannedEndDate}
                dateFormat="dd MMM yyyy"
                isClearable={!!updateTask}
                className="w-36 h-6 rounded-md border-gray-200"
                disabled={!updateTask}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 w-64 border-l h-screen justify-center overflow-y-hidden">
      {!task && (
        <div className="flex justify-center">Task Notes will appear here</div>
      )}
      {task && (
        <div className="h-screen flex flex-1 flex-col">
          <DatePickerWidget />
          <div className="h-16 flex flex-col align-middle justify-center mx-auto border-t w-full">
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
                  label: currentFolder?.name ?? 'Archived',
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
