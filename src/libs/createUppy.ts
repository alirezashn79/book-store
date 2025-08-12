import Uppy from '@uppy/core'
import '@uppy/core/dist/style.min.css'
import '@uppy/dashboard/dist/style.min.css'
import Persian from '@uppy/locales/lib/fa_IR'
import XHR from '@uppy/xhr-upload'

export function createUppy() {
  const endpoint = '/api/media'

  return new Uppy({
    locale: Persian,
    restrictions: {
      maxFileSize: 5_000_000,
      minNumberOfFiles: 1,
      maxNumberOfFiles: 10,
      allowedFileTypes: ['image/*', 'video/*', 'application/pdf'],
    },
    autoProceed: true,
  }).use(XHR, {
    endpoint,
    bundle: false,
    limit: 1,
  })
}
