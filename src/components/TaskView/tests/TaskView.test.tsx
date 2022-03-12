import TestRenderer from 'react-test-renderer'
import TaskView from '../TaskView'

const { act } = TestRenderer

const navigation = [
  {
    id: 'INBOX',
    name: 'Inbox',
  },
  {
    id: 'f939e3fe-e063-4070-a9d6-57cdee7f3c92',
    name: 'New Folder',
  },
]

const navigator = {
  id: 'INBOX',
  name: 'Inbox',
}

test('TaskView', async () => {
  const component = TestRenderer.create(
    <TaskView
      navigator={navigator}
      selectedNavId="INBOX"
      onClickArchiveFolder={async () => {}}
      navigation={navigation}
    />
  )
  const testInstance = component.root
  let tree = component.toJSON() as any
  expect(tree).toMatchSnapshot()

  // const addButton = testInstance.findByProps({ id: 'add-button' })
  // await addButton.props.onClick()
  // tree = component.toJSON()
  // expect(tree).toMatchSnapshot()
})
