# copyToClipboard

Help us to copy any text to user clipboard.

For using inside vue/nuxt you need to call "useCopyClipboard" composable.

copyToClipboard function trying to call navigator.clipboard.writeText method
and if navigator.clipboard is unavailable it's going further and trying to copy textContent from "virtual" HTML element
using window.document.execCommand('copy') method.
