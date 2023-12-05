import express, { Router } from 'express'
import serverless from 'serverless-http'

const api = express()
const router = Router()

// Import individual route handlers
import { handler as getStreetCoordsHandler } from './getStreetCoords.js'
import { handler as getStreetInfoHandler } from './getStreetInfo.js'
import { handler as getDirectionsHandler } from './getDirections.js'

api.use(express.json())


// StreetCoords API
router.post('/getStreetCoords', getStreetCoordsHandler)

// StreetInfo API
router.post('/getStreetInfo', getStreetInfoHandler)

// Directions API
router.post('/getDirections', getDirectionsHandler )

if (process.env.NODE_ENV !== 'production') {
  const port = 3000
  api.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
  })
}

// Set up middleware
api.use('/.netlify/functions/', router)

// Export the serverless app
export const handler = serverless(api)
