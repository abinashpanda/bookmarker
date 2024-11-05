import { createThemeSessionResolver } from 'remix-themes'
import { sessionStorage } from './session.server'

export const themeSessionResolver = createThemeSessionResolver(sessionStorage)
