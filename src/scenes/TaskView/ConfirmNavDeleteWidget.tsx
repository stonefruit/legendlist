import { CheckIcon, TrashIcon, XIcon } from '@heroicons/react/solid'

type TrashState = 'INACTIVE' | 'ACTIVE' | 'CONFIRM'
type Props = {
  trashState: string
  setTrashState: React.Dispatch<React.SetStateAction<TrashState>>
  onClickDeleteFolder: (id: string) => void
  selectedNavId: string
}
export default function ConfirmNavDeleteWidget({
  trashState,
  setTrashState,
  onClickDeleteFolder,
  selectedNavId,
}: Props) {
  return (
    <div>
      {trashState === 'ACTIVE' && (
        <button
          onClick={() => setTrashState('CONFIRM')}
          className="bg-yellow-100 text-yellow-400 rounded-md p-1 border border-yellow-200 cursor-pointer hover:bg-yellow-50 active:bg-white h-6 w-6 outline-none"
        >
          <TrashIcon className="h-full w-full" />
        </button>
      )}
      {trashState === 'CONFIRM' && (
        <div className="flex justify-center items-center">
          <div className="text-sm">Confirm?</div>
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
              onClickDeleteFolder(selectedNavId)
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
