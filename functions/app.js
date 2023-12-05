// import express from 'express'
// import cors from 'cors'
// import serverless from 'serverless-http'

// // Import individual route handlers
// import { handler as getStreetCoordsHandler } from './getStreetCoords.js'
// import { handler as getStreetInfoHandler } from './getStreetInfo.js'
// import { handler as getDirectionsHandler } from './getDirections.js'

// const app = express()

// const router = express.Router()

// // Set up CORS and JSON middleware
// app.use(cors())
// app.use(express.json())

// // Define routes
// router.post('/getStreetCoords', getStreetCoordsHandler)
// router.post('/getStreetInfo', getStreetInfoHandler)
// router.post('/getDirections', getDirectionsHandler)

// if (process.env.NODE_ENV !== 'production') {
//   const port = 3000
//   app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`)
//   })
// }

// // Set up middleware
// app.use('/.netlify/functions/app', router)

// // Export the serverless app
// export const handler = serverless(app)

//////////////////////////////////////////////////////////////////////////////

// import express, {Router} from 'express'
// import serverless from 'serverless-http'
// import fetch from 'node-fetch'
// import cors from 'cors'

// const app = express()
// const PORT = process.env.PORT || 3000
// const router = Router()

// router.get('/getStreetCoords', (req, res) => res.send('StreetCoords'))
// router.get('/getStreetInfo', (req, res) => res.send('StreetInfo'))
// router.get('/getDirections', (req, res) => res.send('Directions'))

// app.use(cors())
// app.use(express.json())

// function coordinatesFormater(array) {
//   if (!array) return
//   return array.map(([latitude, longitude]) => ({
//     latitude,
//     longitude,
//   }))
// }

// const formatString = (str) =>
//   str
//     .split(' ')
//     .map((str, i) => '%20' + str)
//     .join('')

// // StreetCoords API

// app.post('/getStreetCoords', async (req, res) => {
//   try {
//     const { number, name, city } = req.body.address
//     if (!req.body.address) return
//     const apiUrl = `https://trueway-geocoding.p.rapidapi.com/Geocode?address=${number}${formatString(
//       name
//     )}%2C${formatString(city)}&language=en`
//     const options = {
//       method: 'GET',
//       headers: {
//         'X-RapidAPI-Key': '25dfebebfbmsh706c58b0dfdbda2p13c289jsne60f2288d6ac',
//         'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com',
//       },
//     }

//     console.log('Received name:', req.body.address)

//     const response = await fetch(apiUrl, options)
//     const data = await response.json()
//     if (data.results) {
//       const searchResult = data.results.map((item) => {
//         return {
//           id: `${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`,
//           name: `${item.street ? `${item.street} ${item.house}` : `${item.locality}`}, ${item.region && item.region}, ${item.country}`,
//           latitude: item.location.lat,
//           longitude: item.location.lng,
//         }
//       })

//       console.log(searchResult)
//       res.json({ searchResult })
//     } else {
//       res.status(404).json({ error: 'Location not found', details: data })
//     }
//   } catch (error) {
//     console.error('Error:', error)
//     res.status(500).json({ error: 'Internal Server Error' })
//   }
// })

// // StreetInfo API

// app.post('/getStreetInfo', async (req, res) => {
//   try {
//     const { latitude, longitude } = req.body
//     if (!latitude || !latitude) return
//     const apiUrl = `https://trueway-geocoding.p.rapidapi.com/ReverseGeocode?location=${longitude}%2C%20${latitude}&language=en`
//     const options = {
//       method: 'GET',
//       headers: {
//         'X-RapidAPI-Key': '25dfebebfbmsh706c58b0dfdbda2p13c289jsne60f2288d6ac',
//         'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com',
//       },
//     }

//     console.log('Received coordinates:', { longitude, latitude })

//     const response = await fetch(apiUrl, options)
//     const data = await response.json()
//     console.log(data)

//     if (data.results) {
//       const streetInfo =
//         ((data.results[0].street || data.results[0].region) &&
//           `${
//             data.results[0].street === undefined ? '' : data.results[0].street
//           } ${data.results[0].house && data.results[0].house}${
//             data.results[0].street === undefined || !data.results[0].street
//               ? ''
//               : ', '
//           }${data.results[0].country || 'LOL'}`) ||
//         'No information found'
//       console.log(streetInfo)
//       res.json({ streetInfo })
//     } else {
//       res.status(404).json({ error: 'Location not found', details: data })
//     }
//   } catch (error) {
//     console.error('Error:', error)
//     res.status(500).json({ error: 'Internal Server Error' })
//   }
// })

// // Directions API

// app.post('/getDirections', async (req, res) => {
//   const { latitude: latSt, longitude: lngSt } = req.body.origin
//   const { latitude: latFn, longitude: lngFn } = req.body.destination

//   console.log(req.body)

//   const url = `https://trueway-directions2.p.rapidapi.com/FindDrivingPath?origin=${latSt}%2C${lngSt}&destination=${latFn}%2C${lngFn}`

//   const options = {
//     method: 'GET',
//     headers: {
//       'X-RapidAPI-Key': '25dfebebfbmsh706c58b0dfdbda2p13c289jsne60f2288d6ac',
//       'X-RapidAPI-Host': 'trueway-directions2.p.rapidapi.com',
//     },
//   }

//   try {
//     const response = await fetch(url, options)
//     const result = await response.json()
//     const directions = coordinatesFormater(result.route.geometry.coordinates)
//     const { distance, duration } = result.route
//     console.log(directions)
//     res.json({ directions, distance, duration })
//   } catch (error) {
//     console.error(error)
//   }
// })

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`)
// })

// app.use('/app', router)
// export const handler = serverless(app)

import express, { Router } from 'express'
import serverless from 'serverless-http'

// import cors from 'cors'

const app = express()
const router = Router()

// Import individual route handlers
import { handler as getStreetCoordsHandler } from './getStreetCoords.js'
import { handler as getStreetInfoHandler } from './getStreetInfo.js'
import { handler as getDirectionsHandler } from './getDirections.js'

router.get('/app', (req, res) => res.send('App running'))
router.get('/getStreetCoords', (req, res) => res.send('StreetCoords'))
router.get('/getStreetInfo', (req, res) => res.send('StreetInfo'))
router.get('/getDirections', (req, res) => res.send('Directions'))


// app.use(cors({origin: '*'}))
app.use(express.json())

// StreetCoords API
router.post('/getStreetCoords', getStreetCoordsHandler)

// StreetInfo API
router.post('/getStreetInfo', getStreetInfoHandler)

// Directions API
router.post('/getDirections', getDirectionsHandler )

if (process.env.NODE_ENV !== 'production') {
  const port = 3000
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
  })
}

// Set up middleware
app.use('/.netlify/functions/app', router)

// Export the serverless app
export const handler = serverless(app)
