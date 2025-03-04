import type { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import { auth } from './firebase.ts'

export const verifySessionMiddleware = createMiddleware(async (c: Context, next: Next) => {
	const sessionCookie = getCookie(c, 'session') || ''

	try {
		const decodedToken = await auth.verifySessionCookie(sessionCookie, true)
		c.set('userId', decodedToken?.userId)
		c.set('role', decodedToken?.role)
		await next()
	} catch (error) {
		throw new HTTPException(401, {
			message: 'Unauthorized',
		})
	}
})
