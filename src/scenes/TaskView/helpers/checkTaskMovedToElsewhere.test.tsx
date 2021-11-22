import { checkTaskMovedToElsewhere } from './checkTaskMovedToElsewhere'

describe('checkTaskMovedToElsewhere', () => {
  test('does not do anything if no values', () => {
    expect(checkTaskMovedToElsewhere(undefined, undefined)).toStrictEqual({
      shouldBringTaskToTop: false,
      shouldTaskBeActive: false,
    })
  })
  test('should move to top if change folder', () => {
    expect(checkTaskMovedToElsewhere('A', undefined)).toStrictEqual({
      shouldBringTaskToTop: true,
      shouldTaskBeActive: false,
    })
    expect(checkTaskMovedToElsewhere('A', null)).toStrictEqual({
      shouldBringTaskToTop: true,
      shouldTaskBeActive: false,
    })
  })
  test('should move to elsewhere if set completed', () => {
    expect(checkTaskMovedToElsewhere(undefined, 1)).toStrictEqual({
      shouldBringTaskToTop: false,
      shouldTaskBeActive: false,
    })
  })
  test('should move to top and active if set uncompleted', () => {
    expect(checkTaskMovedToElsewhere(undefined, null)).toStrictEqual({
      shouldBringTaskToTop: true,
      shouldTaskBeActive: true,
    })
  })
  test('should not move to top if change folder and set completed', () => {
    expect(checkTaskMovedToElsewhere('A', 1)).toStrictEqual({
      shouldBringTaskToTop: false,
      shouldTaskBeActive: false,
    })
  })
})

// TODO: updateTask is rerunning when I click the list item. probably list item component issue!!!
