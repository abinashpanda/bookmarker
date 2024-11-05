import { themeSessionResolver } from '@/services/theme.server'
import { createThemeAction } from 'remix-themes'

export const action = createThemeAction(themeSessionResolver)
