import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import initiatePayment from './api/initiatePayment.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Welcome to the bKash Payment API')
})

app.post('/api/initiatePayment', initiatePayment)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
