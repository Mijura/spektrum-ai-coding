export function getContentType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'html':
        return 'text/html'
      case 'css':
        return 'text/css'
      case 'js':
        return 'application/javascript'
      case 'json':
        return 'application/json'
      case 'png':
        return 'image/png'
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg'
      case 'svg':
        return 'image/svg+xml'
      case 'ico':
        return 'image/x-icon'
      case 'txt':
        return 'text/plain'
      case 'woff':
        return 'font/woff'
      case 'woff2':
        return 'font/woff2'
      default:
        return 'application/octet-stream'
    }
  }