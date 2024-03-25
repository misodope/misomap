import { style, globalStyle } from '@vanilla-extract/css';

export const myStyle = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '3px',
  gap: '20px',
});

globalStyle('body', {
  margin: "0 auto",
  minHeight: "100vh",
  padding: "0 10%",
});