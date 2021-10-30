// @ts-nocheck
import { useCallback, useMemo } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate, ReactEditor } from 'slate-react'
import {
  Editor,
  Transforms,
  createEditor,
  Element as SlateElement,
  BaseEditor,
} from 'slate'
import { withHistory } from 'slate-history'

import { Button, Toolbar } from './components'

import boldIcon from '../assets/boldIcon.svg'
import codeIcon from '../assets/codeIcon.svg'
import h1Icon from '../assets/h1Icon.svg'
import h2Icon from '../assets/h2Icon.svg'
import italicIcon from '../assets/italicIcon.svg'
import orderedListIcon from '../assets/orderedListIcon.svg'
import unorderedListIcon from '../assets/unorderedListIcon.svg'
import quoteIcon from '../assets/quoteIcon.svg'
import underlineIcon from '../assets/underlineIcon.svg'

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

const RichTextEditor = ({ value, setValue }) => {
  const renderElement = useCallback((props) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  return (
    <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
      <Toolbar>
        <MarkButton format="bold" icon={boldIcon} />
        <MarkButton format="italic" icon={italicIcon} />
        <MarkButton format="underline" icon={underlineIcon} />
        <MarkButton format="code" icon={codeIcon} />
        <div className="w-3" />
        <BlockButton format="heading-one" icon={h1Icon} />
        <BlockButton format="heading-two" icon={h2Icon} />
        <BlockButton format="block-quote" icon={quoteIcon} />
        <BlockButton format="numbered-list" icon={orderedListIcon} />
        <BlockButton format="bulleted-list" icon={unorderedListIcon} />
      </Toolbar>
      <Editable
        className="h-full overflow-y-auto pb-20"
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
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
      <img className="h-full w-auto" src={icon} alt="Workflow" />
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
      <img className="h-full w-auto" src={icon} alt="Workflow" />
    </Button>
  )
}

export default RichTextEditor
