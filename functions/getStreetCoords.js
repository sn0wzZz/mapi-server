import fetch from 'node-fetch'

export async function handler(event, context) {
  try {
    const { address } = JSON.parse(event.body)

    console.log(address)

    if (!address) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request parameters' }),
      }
    }

    const apiUrl = `https://trueway-geocoding.p.rapidapi.com/Geocode?address=${formatString(
      address
    )}&language=en`

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '25dfebebfbmsh706c58b0dfdbda2p13c289jsne60f2288d6ac',
        'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com',
      },
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (data.results) {
      const searchResult = data.results[0].location

      return {
        statusCode: 200,
        body: JSON.stringify({ searchResult }),
      }
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Location not found', details: data }),
      }
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    }
  }
}

function formatString(str) {
  return str
    .split(' ')
    .map((word, i) => (i === 0 ? word : '%20' + word))
    .join('')
}
