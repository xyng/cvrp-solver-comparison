import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function Dropzone(props) {
  const onDrop = useCallback(acceptedFiles => {
    const reader = new FileReader()

    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')
    reader.onload = () => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result
      props.callback(JSON.parse(binaryStr));
    }

    acceptedFiles.forEach(file => reader.readAsBinaryString(file))
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div className="border border-primary rounded p-4" {...getRootProps()}>
      <input {...getInputProps()} />
      <p className="lead mb-0 text-primary">Drag 'n' drop or click and select file</p>
    </div>
  )
}