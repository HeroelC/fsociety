/**
 * The size of a form control.
 *
 * Every control in the library shares one height scale — 32 / 40 / 48px — so a
 * button and a field declared at the same size line up when they sit next to
 * each other. Before this existed each field hardcoded its own `height: 40px`
 * and the button ran on 28/36/44, which meant no button size could ever match
 * a field.
 *
 * The scale itself lives in `styles/_control-size.scss`, which is the single
 * source of truth for height, padding, typography and icon sizing. This type
 * only names the three steps.
 */
export type FsControlSize = 'sm' | 'md' | 'lg';
