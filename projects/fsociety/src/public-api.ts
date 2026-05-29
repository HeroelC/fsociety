/*
 * Public API Surface of fsociety
 */

export * from './lib/fsociety.service';
export * from './lib/fsociety.component';

export * from './lib/button/button.component';
export type { FsButtonVariant, FsButtonSize, FsButtonType } from './lib/button/button.component';

export * from './lib/badge/badge.component';
export type { FsBadgeColor, FsBadgeVariant, FsBadgeSize } from './lib/badge/badge.component';

export * from './lib/tabs/tabs.component';
export type { FsTab } from './lib/tabs/tabs.component';

export * from './lib/alert/alert.component';
export type { FsAlertType, FsAlertVariant } from './lib/alert/alert.component';

export * from './lib/experience-card/experience-card.component';
export type { FsExperienceCard, FsExperienceBadge } from './lib/experience-card/experience-card.component';

export * from './lib/profile-card/profile-card.component';
export type { FsProfileStat, FsProfileLink, FsProfileBadge } from './lib/profile-card/profile-card.component';

export { FsInputComponent } from './lib/input/input.component';
export type { FsInputType, FsInputState } from './lib/input/input.component';

export { FsSelectComponent } from './lib/select/select.component';
export type { FsSelectOption, FsSelectState } from './lib/select/select.component';

export { FsCheckboxComponent } from './lib/choice/checkbox.component';
export type { FsCheckboxState } from './lib/choice/checkbox.component';

export { FsRadioGroupComponent } from './lib/choice/radio-group.component';
export type { FsRadioOption } from './lib/choice/radio-group.component';

export { FsSwitchComponent } from './lib/choice/switch.component';

export { FsSegmentedComponent } from './lib/choice/segmented.component';
export type { FsSegmentOption } from './lib/choice/segmented.component';
