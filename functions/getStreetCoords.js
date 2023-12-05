import fetch from 'node-fetch'

export async function handler(event, context) {
  try {
    const { number, name, city } = JSON.parse(event.body)

    context.send('hello')

    if (!number || !name || !city) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request parameters' }),
      }
    }

    const apiUrl = `https://trueway-geocoding.p.rapidapi.com/Geocode?address=${number}${formatString(
      name
    )}%2C${formatString(city)}&language=en`

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
      const searchResult = data.results.map((item) => {
        return {
          id: `${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`,
          name: `${
            item.street ? `${item.street} ${item.house}` : `${item.locality}`
          }, ${item.region && item.region}, ${item.country}`,
          latitude: item.location.lat,
          longitude: item.location.lng,
        }
      })

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
    .map((str, i) => '%20' + str)
    .join('')
}
