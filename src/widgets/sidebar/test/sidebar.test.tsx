import { render, screen } from '@testing-library/react'
import { describe, it } from 'vitest'

import { Sidebar } from '../ui/sidebar'

describe('Sidebar', () => {
  it('renders the Sidebar component', () => {
    render(<Sidebar />)

    screen.debug()
  })
})
