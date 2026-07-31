"use server"
// createRentalAction(gearId, quantity, startDate, endDate) -> POST /api/rentals; cancelRentalAction(id) -> PATCH /api/rentals/:id/cancel. Forwards Cookie: accessToken=... header, revalidateTag('my-rentals') on success
