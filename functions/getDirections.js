import fetch from 'node-fetch'

export async function handler (req, res) {
  const { latitude: latSt, longitude: lngSt } = req.body.origin
  const { latitude: latFn, longitude: lngFn } = req.body.destination

  console.log(req.body)

  const url = `https://trueway-directions2.p.rapidapi.com/FindDrivingPath?origin=${latSt}%2C${lngSt}&destination=${latFn}%2C${lngFn}`

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '25dfebebfbmsh706c58b0dfdbda2p13c289jsne60f2288d6ac',
      'X-RapidAPI-Host': 'trueway-directions2.p.rapidapi.com',
    },
  }

  try {
    const response = await fetch(url, options)
    const result = await response.json()
    const directions = coordinatesFormatter(result.route.geometry.coordinates)
    const { distance, duration } = result.route
    console.log(directions)
    res.json({ directions, distance, duration })
  } catch (error) {
    console.error(error)
  }
}

function coordinatesFormatter(array) {
  if (!array) return
  return array.map(([latitude, longitude]) => ({
    latitude,
    longitude,
  }))
}
