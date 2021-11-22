export function checkTaskMovedToElsewhere(
  folderId: string | undefined,
  actualEndDate: number | null | undefined
) {
  console.log({ folderId, actualEndDate })
  const isMovingFolder = !!folderId
  const isSettingToUncompleted = actualEndDate === null

  const shouldBringTaskToTop =
    (isMovingFolder && !actualEndDate) || isSettingToUncompleted

  const shouldTaskBeActive = !isMovingFolder && isSettingToUncompleted

  return { shouldBringTaskToTop, shouldTaskBeActive }
}
