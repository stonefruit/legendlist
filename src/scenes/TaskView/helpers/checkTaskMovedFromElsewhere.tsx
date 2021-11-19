// TODO: add tests
export function checkTaskMovedFromElsewhere(
  folderId: string | undefined,
  actualEndDate: number | null | undefined
) {
  const isMovingFolder = !!folderId
  const isSettingToUncompleted = actualEndDate === null
  const shouldBringTaskToTop = isMovingFolder || isSettingToUncompleted
  const orderInFolder = shouldBringTaskToTop ? -1 : undefined
  const taskMovedFromElsewhere = shouldBringTaskToTop || actualEndDate
  return { orderInFolder, taskMovedFromElsewhere }
}
