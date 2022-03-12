// @ts-nocheck
import isHotkey from 'is-hotkey'
import { useCallback, useMemo } from 'react'
import {
  Editor,
  Transforms,
  createEditor,
  Element as SlateElement,
  BaseEditor,
} from 'slate'
import { withHistory } from 'slate-history'
import { Editable, withReact, useSlate, Slate, ReactEditor } from 'slate-react'
import { Button, Toolbar } from './components'
import {
  BoldIcon,
  CodeIcon,
  H1Icon,
  H2Icon,
  ItalicIcon,
  OrderedListIcon,
  QuoteIcon,
  UnderlineIcon,
  UnorderedListIcon,
} from '../../assets'

type EditorType = BaseEditor & ReactEditor
type CustomText = { text: string }
type CustomElement = { type: 'paragraph' | string; children: CustomText[] }

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+\\': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const RichTextEditor = ({ value, setValue, readOnly }) => {
  const renderElement = useCallback((props) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  return (
    <Slate editor={editor} value={value} onChange={(val) => setValue(val)}>
      {!readOnly && (
        <Toolbar>
          <MarkButton
            format="bold"
            icon={() => BoldIcon({ width: 15, height: 15, fill: 'black' })}
          />
          <MarkButton
            format="italic"
            icon={() => ItalicIcon({ width: 20, height: 20, fill: 'black' })}
          />
          <MarkButton
            format="underline"
            icon={() => UnderlineIcon({ width: 20, height: 20, fill: 'black' })}
          />
          <MarkButton
            format="code"
            icon={() => CodeIcon({ width: 20, height: 20, fill: 'black' })}
          />
          <div className="w-3" />
          <BlockButton
            format="heading-one"
            icon={() => H1Icon({ width: 32, height: 32, fill: 'black' })}
          />
          <BlockButton
            format="heading-two"
            icon={() => H2Icon({ width: 32, height: 32, fill: 'black' })}
          />
          <BlockButton
            format="block-quote"
            icon={() => QuoteIcon({ width: 20, height: 20, fill: 'black' })}
          />
          <BlockButton
            format="numbered-list"
            icon={() =>
              OrderedListIcon({ width: 20, height: 20, fill: 'black' })
            }
          />
          <BlockButton
            format="bulleted-list"
            icon={() =>
              UnorderedListIcon({ width: 20, height: 20, fill: 'black' })
            }
          />
        </Toolbar>
      )}
      <Editable
        readOnly={readOnly}
        className="h-full overflow-y-auto pb-20"
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={readOnly ? '' : 'Enter some rich text…'}
        onKeyDown={(event) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault()
              const mark = (HOTKEYS as any)[hotkey] as string
              toggleMark(editor, mark)
            }
          }
        }}
      />
    </Slate>
  )
}

const toggleBlock = (editor: EditorType, format: string) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  })
  const newProperties: Partial<SlateElement> = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  }
  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block: CustomElement = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor: EditorType, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor: EditorType, format: string) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Editor.nodes(editor, {
    at: Editor.unhangRange(editor, selection),
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  })

  return !!match
}

const isMarkActive = (editor: EditorType, format: string) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote
          className="border-l-2 border-gray-400 text-gray-500 pl-10 italic mt-1"
          {...attributes}
        >
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <ul className="pl-8 mt-1 list-disc" {...attributes}>
          {children}
        </ul>
      )
    case 'heading-one':
      return (
        <h1 className="mt-1 text-5xl" {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 className="mt-1 text-3xl" {...attributes}>
          {children}
        </h2>
      )
    case 'list-item':
      return (
        <li className="mt-1" {...attributes}>
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol className="pl-8 mt-1 list-decimal" {...attributes}>
          {children}
        </ol>
      )
    default:
      return (
        <p className="mt-1" {...attributes}>
          {children}
        </p>
      )
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code className="bg-gray-100 p-1">{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <div className="flex items-center justify-center h-full w-full">
        {icon({ height: 32, width: 32 })}
      </div>
    </Button>
  )
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event) => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <div className="flex items-center justify-center h-full w-full">
        {icon({ height: 32, width: 32 })}
      </div>
    </Button>
  )
}

export default RichTextEditor
