import { useEffect, useState } from 'react'
import { Descendant } from 'slate'
import RichTextEditor from '../components/RichTextEditor'
import { Task } from '../types'
import * as models from '../models'

type Props = {
  task: Task | null
}
const initialData = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]
export default function NoteView({ task }: Props) {
  const [value, setValue] = useState<Descendant[]>(initialData)
  const [shouldRefreshEditor, setShouldRefreshEditor] = useState(false)

  useEffect(() => {
    setShouldRefreshEditor(true)
    setValue(task?.content || initialData)
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
    <div className="flex flex-col flex-1 w-64 border-l h-screen justify-center align-middle overflow-y-hidden">
      {!task && (
        <div className="flex justify-center">Task Notes will appear here</div>
      )}
      {task && (
        <div className="bg-white h-screen flex flex-1 flex-col">
          <div className="h-20 flex flex-col align-middle justify-center mx-auto">
            <div>Top Part</div>
          </div>
          {!shouldRefreshEditor && (
            <div className="h-auto overflow-y-auto flex flex-1 flex-col border-t border-b pr-5 pl-5 py-5">
              <RichTextEditor value={value} setValue={setValue} />
            </div>
          )}
          <div className="h-20 flex flex-col align-middle justify-center mx-auto">
            <div>Bottom Part</div>
          </div>
        </div>
      )}
    </div>
  )
}
