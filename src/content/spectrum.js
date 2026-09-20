// The signature visual. Shape from DESIGN_SPEC section 8.1 (spectrum.js); values from
// DESIGN_SPEC sections 4.4 and 5. The comb is procedurally generated from `seed`; it is an
// illustration of the research subject, not a measurement from the testbed, and every caption
// says so. The hero and the research figure share the same seed and fault channel.
export default {
  seed: 0x5a17,
  channels: 96,
  faultChannel: 61,
  captionLeft: 'C+L band · 96 ch · Illustrative',
  captionLeftShort: '96 ch · Illustrative',
  faultLabel: 'Localized',
  figureCaption: 'Figure · 96-channel C+L comb · Illustrative',
  figureCaptionShort: '96-ch comb · Illustrative',
  ariaLabel:
    'Illustrative rendering of a 96-channel C+L band comb with one channel, 61, marked as localized. It is a schematic of the research subject, not a measurement from the testbed.',
}
