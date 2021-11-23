import TestRenderer from 'react-test-renderer'
import AddTaskBar from '../AddTaskBar'

const { act } = TestRenderer

test('AddTaskBar', async () => {
  const component = TestRenderer.create(<AddTaskBar addTask={async () => {}} />)
  const testInstance = component.root
  let tree = component.toJSON() as any
  expect(tree).toMatchSnapshot()

  const addButton = testInstance.findByProps({ id: 'add-button' })
  await addButton.props.onClick()
  tree = component.toJSON()
  expect(tree).toMatchSnapshot()

  const addTaskTextField = testInstance.findByProps({
    id: 'new-task-text-field',
  })
  act(() => {
    addTaskTextField.props.onChange({ target: { value: 'TEST' } })
  })
  tree = component.toJSON()
  expect(tree).toMatchSnapshot()

  await act(async () => {
    await addTaskTextField.props.onKeyUp({ key: 'Enter' })
  })
  tree = component.toJSON()
  expect(tree).toMatchSnapshot()
  const addTaskTextField2 = testInstance.findByProps({
    id: 'new-task-text-field',
  })
  expect(addTaskTextField2.props.value).toBe('')
})
