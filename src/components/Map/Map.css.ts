import { style } from '@vanilla-extract/css';

export const mapContainer = style({
  height: '100%',
  width: '100%',
});

export const mapStyle = style({
  height: '100%',
  width: '100%',
});

export const mapLegendStyle = style({
  backgroundColor: '#dddddd',
  padding: '0.5rem',
  borderRadius: '0.5rem',
  boxShadow: '0 0 0.5rem rgba(0, 0, 0, 0.5)',
  margin: '1rem',
});

export const mapLegendIconStyle = style({
  width: '2rem',
  height: '2rem',
  marginRight: '0.5rem',
});

export const mapLegendIconTextStyle = style({
  fontSize: '1.5rem',
});

export const mapIconContainer = style({
  display: 'flex',
  alignItems: 'center',
});