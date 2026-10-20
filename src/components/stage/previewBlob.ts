/** The most recent PDF blob the live preview produced (used for "open in new tab"). */
let latest: Blob | null = null
export const setPreviewBlob = (b: Blob | null) => {
  latest = b
}
export const getPreviewBlob = () => latest
