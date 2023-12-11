import fetch from 'node-fetch'

export async function handler(event, context) {
  try {
    console.log('Request body:', event.body)
    const { queryStr } = JSON.parse(event.body)
    // const { queryStr } = event.body

    if (!queryStr) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request parameters' }),
      }
    }

    const apiUrl = `https://place-autocomplete1.p.rapidapi.com/autocomplete/json?input=${encodeURIComponent(
      queryStr
    )}&radius=500`
    // const apiUrl = 'https://place-autocomplete1.p.rapidapi.com/autocomplete/json?input=new&radius=500';

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '25dfebebfbmsh706c58b0dfdbda2p13c289jsne60f2288d6ac',
        'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com',
      },
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    console.log(response)

    if (data) {
      console.log(data)
      const searchResult = data.predictions.map((item) => {
        return {
          id: `${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`,
          name: item.description,
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
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    }
  }
}
