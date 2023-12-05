import fetch from 'node-fetch'

export async function handler(req, res){
  res.send('StreetCoords')
  try {
    const { number, name, city } = req.body.address
    if (!req.body.address) return
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

    console.log('Received name:', req.body.address)

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

      console.log(searchResult)
      res.json({ searchResult })
    } else {
      res.status(404).json({ error: 'Location not found', details: data })
    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

function formatString(str) {
  return str
    .split(' ')
    .map((str, i) => '%20' + str)
    .join('')
}
