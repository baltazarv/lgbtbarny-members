// ideal stripe api code
import { stripe } from '../utils/stripe'

const apiRetrieveCoupon = async (req, res) => {
  // console.log('/api/payments/retrieve-coupon')

  const code = req.body
  try {
    const coupon = await stripe.coupons.retrieve(code)
    res.status(200).json({ coupon })
  } catch (error) {
    /**
     * 404 error:
     * * statusCode: 404
     * * code: 'resource_missing'
     * * message: 'No such coupon: "..."'
     * * type: 'invalid_request_error'
     */
    const { statusCode, code, type } = error
    const message = error.raw.message
    res.status(error.statusCode).json({
      error: {
        statusCode,
        code,
        message,
        type,
      }
    })
  }
}

export default apiRetrieveCoupon