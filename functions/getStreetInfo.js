import fetch from 'node-fetch'

export async function handler (req, res) {
  try {
    const { latitude, longitude } = req.body
    if (!latitude || !latitude) return
    const apiUrl = `https://trueway-geocoding.p.rapidapi.com/ReverseGeocode?location=${longitude}%2C%20${latitude}&language=en`
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '25dfebebfbmsh706c58b0dfdbda2p13c289jsne60f2288d6ac',
        'X-RapidAPI-Host': 'trueway-geocoding.p.rapidapi.com',
      },
    }

    console.log('Received coordinates:', { longitude, latitude })

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(data)

    if (data.results) {
      const streetInfo =
        ((data.results[0].street || data.results[0].region) &&
          `${
            data.results[0].street === undefined ? '' : data.results[0].street
          } ${data.results[0].house && data.results[0].house}${
            data.results[0].street === undefined || !data.results[0].street
              ? ''
              : ', '
          }${data.results[0].country || 'LOL'}`) ||
        'No information found'
      console.log(streetInfo)
      res.json({ streetInfo })
    } else {
      res.status(404).json({ error: 'Location not found', details: data })
    }
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
