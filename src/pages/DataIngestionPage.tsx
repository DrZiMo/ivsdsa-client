import { useState } from 'react'
import { MainLayout } from '@/layouts/MainLayout'
import { useFileUpload, useProcessingHistory } from '@/hooks/useQueries'

/**
 * File Upload Drop-zone Component
 */
const FileUploadZone: React.FC<{
  onFileSelected: (file: File) => void
  isLoading?: boolean
}> = ({ onFileSelected, isLoading = false }) => {
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      onFileSelected(files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0])
    }
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
        isDragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-gray-50 hover:border-blue-400'
      }`}
    >
      <div className='flex flex-col items-center gap-3'>
        <span className='material-symbols-outlined text-4xl text-gray-600'>
          cloud_upload
        </span>
        <div>
          <p className='text-gray-900 font-semibold'>
            Drag and drop your data file here
          </p>
          <p className='text-gray-600 text-sm'>or</p>
          <label className='inline-block cursor-pointer'>
            <span className='text-blue-600 font-medium hover:underline'>
              browse files
            </span>
            <input
              type='file'
              onChange={handleChange}
              disabled={isLoading}
              className='hidden'
              accept='.csv,.xlsx,.json,.xml'
            />
          </label>
        </div>
        <p className='text-xs text-gray-600 mt-2'>
          Supported formats: CSV, XLSX, JSON, XML (Max 100MB)
        </p>
      </div>

      {isLoading && (
        <div className='mt-4 flex items-center justify-center gap-2'>
          <div className='animate-spin'>
            <span className='material-symbols-outlined text-blue-600'>
              autorenew
            </span>
          </div>
          <p className='text-blue-600 font-medium'>Processing file...</p>
        </div>
      )}
    </div>
  )
}

/**
 * Data Ingestion Page
 */
export const DataIngestionPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState('survey')
  const [description, setDescription] = useState('')
  const uploadMutation = useFileUpload()
  const historyQuery = useProcessingHistory(10)

  const handleFileSelected = (file: File) => {
    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      await uploadMutation.mutateAsync({
        file: selectedFile,
        fileType,
        description,
      })
      setSelectedFile(null)
      setDescription('')
      setFileType('survey')
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const uploadHistory = historyQuery.data || []

  return (
    <MainLayout pageTitle='Data Management'>
      <div className='space-y-8'>
        {/* Upload Section */}
        <div className='bg-white border border-gray-200 rounded-lg p-8'>
          <div className='mb-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              Upload New Data
            </h3>
            <p className='text-gray-600 text-sm'>
              Upload survey responses, household data, or connectivity metrics
            </p>
          </div>

          <div className='space-y-6'>
            {/* File Type and Description */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>
                  Data Type
                </label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  <option value='survey'>Survey Responses</option>
                  <option value='household'>Household Data</option>
                  <option value='connectivity'>Connectivity Metrics</option>
                  <option value='regional'>Regional Distribution</option>
                </select>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>
                  Description (Optional)
                </label>
                <input
                  type='text'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='e.g., Q4 2023 Survey'
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
              </div>
            </div>

            {/* File Upload Zone */}
            <FileUploadZone
              onFileSelected={handleFileSelected}
              isLoading={uploadMutation.isPending}
            />

            {/* Selected File Info */}
            {selectedFile && (
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <span className='material-symbols-outlined text-blue-600'>
                    description
                  </span>
                  <div>
                    <p className='font-medium text-gray-900'>
                      {selectedFile.name}
                    </p>
                    <p className='text-sm text-gray-600'>
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className='text-gray-600 hover:text-gray-900'
                >
                  <span className='material-symbols-outlined'>close</span>
                </button>
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploadMutation.isPending}
              className='w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
            >
              {uploadMutation.isPending ? 'Uploading...' : 'Upload File'}
            </button>

            {uploadMutation.isError && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3'>
                <span className='material-symbols-outlined text-red-600 mt-0.5'>
                  error
                </span>
                <div>
                  <p className='font-medium text-red-900'>Upload Failed</p>
                  <p className='text-sm text-red-800'>
                    Please check the file format and try again.
                  </p>
                </div>
              </div>
            )}

            {uploadMutation.isSuccess && (
              <div className='bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3'>
                <span className='material-symbols-outlined text-green-600 mt-0.5'>
                  check_circle
                </span>
                <div>
                  <p className='font-medium text-green-900'>
                    Upload Successful
                  </p>
                  <p className='text-sm text-green-800'>
                    Your file is being processed. Check the history below for
                    status updates.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Processing History */}
        <div className='bg-white border border-gray-200 rounded-lg overflow-hidden'>
          <div className='p-6 border-b border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Processing History
            </h3>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead className='bg-gray-50 border-b border-gray-200'>
                <tr>
                  <th className='px-6 py-3 text-left font-semibold text-gray-900'>
                    File Name
                  </th>
                  <th className='px-6 py-3 text-left font-semibold text-gray-900'>
                    Type
                  </th>
                  <th className='px-6 py-3 text-left font-semibold text-gray-900'>
                    Uploaded
                  </th>
                  <th className='px-6 py-3 text-left font-semibold text-gray-900'>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {uploadHistory.length > 0 ? (
                  uploadHistory.map((upload) => (
                    <tr key={upload.fileId} className='hover:bg-gray-50'>
                      <td className='px-6 py-3 text-gray-900 font-medium'>
                        {upload.fileName}
                      </td>
                      <td className='px-6 py-3 text-gray-600'>
                        {upload.uploadedAt}
                      </td>
                      <td className='px-6 py-3 text-gray-600'>
                        {new Date(upload.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-3'>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded ${
                            upload.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : upload.status === 'processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {upload.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className='px-6 py-8 text-center text-gray-600'
                    >
                      No uploads yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
