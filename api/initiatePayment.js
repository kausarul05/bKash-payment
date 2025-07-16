import axios from 'axios'

const {
  BKASH_BASE_URL,
  BKASH_APP_KEY,
  BKASH_APP_SECRET,
  BKASH_USERNAME,
  BKASH_PASSWORD
} = process.env

let id_token = null

const getToken = async () => {
  const res = await axios.post(
    `${BKASH_BASE_URL}/tokenized/checkout/token/grant`,
    {
      app_key: BKASH_APP_KEY,
      app_secret: BKASH_APP_SECRET
    },
    {
      headers: {
        username: BKASH_USERNAME,
        password: BKASH_PASSWORD,
        'Content-Type': 'application/json'
      }
    }
  )
  id_token = res.data.id_token
  return id_token
}

const initiatePayment = async (req, res) => {
  // res.send("Initiating payment before try...")
  try {
    // res.send("Initiating payment...")
    if (!id_token) await getToken();

    // res.send("Token retrieved successfully...", id_token);

    const { amount } = req.body;

    // res.send("amount: " + amount);

    const response = await axios.post(
      `${BKASH_BASE_URL}/tokenized/checkout/create`,
      {
        mode: '0011',
        payerReference: '',
        merchantInvoiceNumber: 'Inv' + Date.now(),
        amount: amount.toString(),
        currency: 'BDT',
        intent: 'sale'
      },
      {
        headers: {
          authorization: id_token,
          'x-app-key': BKASH_APP_KEY,
          'Content-Type': 'application/json'
        }
      }
    )

    res.status(200).json({ paymentUrl: response.data.bkashURL })
  } catch (error) {
    console.error(error.response?.data || error.message)
    res.status(500).json({ message: 'Payment initiation failed.' })
  }
}

export default initiatePayment
