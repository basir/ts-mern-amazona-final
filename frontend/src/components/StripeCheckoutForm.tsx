import {
  CardElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { StripeElementsOptions } from '@stripe/stripe-js'
import React from 'react'
import { Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { getError } from '../utils'
import { ApiError } from '../types/ApiError'

export default function StripeCheckoutForm({
  orderId,
  refetch,
  options,
  payOrder,
}: {
  orderId: string
  refetch: Function
  options: StripeElementsOptions
  payOrder: Function
}) {
  const stripe = useStripe()
  const elements = useElements()
  const styleOptions = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
  }

  const stripeSubmitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      toast.error('Stripe not loaded')
      return
    }

    const result = await stripe.confirmCardPayment(options.clientSecret!, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    })

    if (result.error) {
      toast.error(result.error.message)
    } else {
      try {
        await payOrder({ orderId: orderId, ...result.paymentIntent })
        refetch()
        toast.success('Order is paid')
        console.log('[PaymentIntent]', result.paymentIntent)
      } catch (err) {
        toast.error(getError(err as ApiError))
      }
    }
  }
  return (
    <div className="my-3">
      <form onSubmit={stripeSubmitHandler}>
        <CardElement
          options={styleOptions}
          className="sr-input sr-card-element"
        />

        <div className="d-grid my-3">
          <Button type="submit">Pay</Button>
        </div>
      </form>
    </div>
  )
}
