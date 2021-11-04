import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

type MyDropzoneProps = {
  setImportedContent: React.Dispatch<React.SetStateAction<string | null>>
}
export default function MyDropzone({ setImportedContent }: MyDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach((file: Blob) => {
        const reader = new FileReader()

        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
          const fileAsString = reader.result as string
          setImportedContent(fileAsString)
        }
        reader.readAsText(file)
      })
    },
    [setImportedContent]
  )
  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div
      className="w-full h-full flex justify-center items-center"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <p>Drag 'n' drop some files here, or click to select files</p>
    </div>
  )
}
