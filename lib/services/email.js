export async function sendItineraryEmail(data) {
  // Prepare structure for: route, price, itinerary
  const { route, price, itinerary } = data;
  
  // Scaffold for future email provider (e.g. SendGrid / Resend)
  console.log(`[EMAIL] Preparing to send itinerary email to user for route: ${route}, price: €${price}`);
  
  if (itinerary) {
    console.log(`[EMAIL] Included itinerary details.`);
  }
  
  return { success: true };
}
