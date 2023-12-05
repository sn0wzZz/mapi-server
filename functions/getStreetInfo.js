import fetch from 'node-fetch'

export async function handler(event, context) {
  try {
    const { latitude, longitude } = JSON.parse(event.body)

    if (!latitude || !longitude) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request parameters' }),
      }
    }

    const apiUrl = `https://trueway-geocoding.p.rapidapi.com/ReverseGeocode?location=${longitude}%2C%20${latitude}&language=en`

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '25dfebebfbmsh706c58b0dfdbda2p13c289jsne60f2288d6ac',
        'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com',
      },
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (data.results && data.results[0]) {
      const streetInfo = `${
        data.results[0].street || data.results[0].locality
      } ${data.results[0].house || ''}, ${data.results[0].region || ''}, ${
        data.results[0].country || ''
      }`

      return {
        statusCode: 200,
        body: JSON.stringify({ streetInfo }),
      }
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Street info not found', details: data }),
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
