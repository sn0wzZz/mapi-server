import fetch from 'node-fetch'

export async function handler(event, context) {
  try {
    const { origin, destination } = JSON.parse(event.body)

    if (!origin || !destination) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request parameters' }),
      }
    }

    const { latitude: latSt, longitude: lngSt } = origin
    const { latitude: latFn, longitude: lngFn } = destination

    const url = `https://trueway-directions2.p.rapidapi.com/FindDrivingPath?origin=${latSt}%2C${lngSt}&destination=${latFn}%2C${lngFn}`

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '25dfebebfbmsh706c58b0dfdbda2p13c289jsne60f2288d6ac',
        'X-RapidAPI-Host': 'trueway-directions2.p.rapidapi.com',
      },
    }

    const response = await fetch(url, options)
    const result = await response.json()

    if (
      result.route &&
      result.route.geometry &&
      result.route.geometry.coordinates
    ) {
      const directions = coordinatesFormatter(result.route.geometry.coordinates)
      const { distance, duration } = result.route

      return {
        statusCode: 200,
        body: JSON.stringify({ directions, distance, duration }),
      }
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Directions not found',
          details: result,
        }),
      }
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    }
  }
}

function coordinatesFormatter(array) {
  if (!array) return
  return array.map(([latitude, longitude]) => ({
    latitude,
    longitude,
  }))
}
