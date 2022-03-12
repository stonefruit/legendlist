// TODO: Add state testing
import { CheckIcon, ArchiveIcon, XIcon } from '@heroicons/react/solid'

type TrashState = 'INACTIVE' | 'ACTIVE' | 'CONFIRM'
type Props = {
  trashState: string
  setTrashState: React.Dispatch<React.SetStateAction<TrashState>>
  onClickArchiveFolder: (id: string) => void
  selectedNavId: string
  isArchived: boolean
}
export default function ConfirmNavDeleteWidget({
  trashState,
  setTrashState,
  onClickArchiveFolder,
  selectedNavId,
  isArchived,
}: Props) {
  return (
    <div>
      {trashState === 'ACTIVE' && (
        <button
          onClick={() => setTrashState('CONFIRM')}
          className="bg-yellow-100 text-yellow-400 rounded-md p-1 border border-yellow-200 cursor-pointer hover:bg-yellow-50 active:bg-white h-6 w-6 outline-none"
        >
          <ArchiveIcon className="h-full w-full" />
        </button>
      )}
      {trashState === 'CONFIRM' && (
        <div className="flex justify-center items-center">
          <div className="text-sm">{`${
            isArchived ? 'Una' : 'A'
          }rchive this folder?`}</div>
          <button
            onClick={() => {
              setTrashState('ACTIVE')
            }}
            className="ml-1 bg-yellow-100 text-yellow-400 rounded-md p-1 border border-yellow-200 cursor-pointer hover:bg-yellow-50 active:bg-white h-6 w-6 outline-none"
          >
            <XIcon className="h-full w-full" />
          </button>
          <button
            onClick={() => {
              setTrashState('ACTIVE')
              onClickArchiveFolder(selectedNavId)
            }}
            className="ml-1 bg-yellow-100 text-yellow-400 rounded-md p-1 border border-yellow-200 cursor-pointer hover:bg-yellow-50 active:bg-white h-6 w-6 outline-none"
          >
            <CheckIcon className="h-full w-full" />
          </button>
        </div>
      )}
    </div>
  )
}
