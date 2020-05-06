const http = require('http')
const path = require('path')
const fs = require('fs')

const server = http.createServer((request, response) => {
  let filePath = path.join(
    __dirname,
    'public',
    request.url === '/' ? 'index.html' : request.url
  )

  const fileExtention = path.extname(filePath)

  let contentType = 'text/html'
  switch (fileExtention) {
    case '.js':
      contentType = 'text/javascript'
      break
    case '.css':
      contentType = 'text/css'
      break
    case '.json':
      contentType = 'application/json'
      break
    case '.png':
      contentType = 'image/png'
      break
    case '.jpg':
      contentType = 'image/jpg'
      break
  }

  if(contentType === 'text/html' && fileExtention === '') filePath += '.html'

  fs.readFile(filePath, (error, content) => {
    if(error) {
      console.log(`Error: ${error.code}`)

      if(error.code === 'ENOENT') {
        // page not found
        fs.readFile(
          path.join(__dirname, 'public', '404.html'),
          (error, content) => {
            if(error) throw error;
            response.writeHead(404, { 'Content-Type': 'text/html'})
            response.end(content, 'utf8')
          }
        )
      } else {
        response.writeHead(500)
        response.end(`Server error: ${error.code}`)
      }
    } else {
      console.log(`Served page: ${filePath}`)
      response.writeHead(200, { 'Content-Type': contentType })
      response.end(content, 'utf8')
    }
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server is running on port ${PORT}..`))
