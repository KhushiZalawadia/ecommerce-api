// =========================================================
//  The standard response shape for EVERY endpoint.
//  Confirmed format:  { success, message, data }
// =========================================================

export function ok(data: any = null, message: string = "Success"): object {
  return { success: true, message, data };
}

export function fail(message: string = "Something went wrong", data: any = null): object {
  return { success: false, message, data };
}