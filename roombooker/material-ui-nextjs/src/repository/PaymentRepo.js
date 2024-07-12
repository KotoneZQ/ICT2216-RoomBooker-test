"use server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function createPaymentIntent(paymentIntentData) {
  const payload = {
      room_id: paymentIntentData.roomId,
      room_count: paymentIntentData.roomCount,
      check_in_date: paymentIntentData.checkInDate,
      check_out_date: paymentIntentData.checkOutDate,
      paid_amount: paymentIntentData.paidAmount,
      user_id: paymentIntentData.userId
  }
  
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/create-payment-intent/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error("Error in createPaymentIntent: "+ errorData.detail || 'Failed to create payment intent');
    }
    return response.json();
  } catch (error) {
    throw error;
  }
}

export async function updatePaymentStatus(paymentData) {
    const paymentDataPayload = {
        payment_status: paymentData.paymentStatus,
        payment_id: paymentData.paymentId,
        reservation_id: paymentData.reservationId,
        total_price: paymentData.totalPrice,
        room_id: paymentData.roomId
    }

    try {
      const response = await fetch(`${BACKEND_API_URL}/api/update-payment-status/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentDataPayload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Error in updatePaymentIntent: "+ errorData.detail || 'Failed to create payment intent');
      }
  
      return response.json();
    } catch (error) {
      throw error;
    }
}
  