// Import React dependencies.
import { useState } from 'react'
import { Descendant } from 'slate'
import RichTextEditor from '../components/RichTextEditor'

export default function NoteView() {
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ])

  return (
    <div className="flex flex-col flex-1 w-64 border-l h-screen justify-center align-middle overflow-y-auto">
      {/* <div className="flex justify-center">Task Notes will appear here</div> */}

      <RichTextEditor value={value} setValue={setValue} />
    </div>
  )
}
