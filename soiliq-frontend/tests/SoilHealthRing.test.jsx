import { render, screen } from '@testing-library/react';
import SoilHealthRing from '@/components/SoilHealthRing';

describe('SoilHealthRing', () => {
  it('renders score', () => {
    render(<SoilHealthRing score={75} />);
    expect(screen.getByText('75')).toBeInTheDocument();
  });
});
