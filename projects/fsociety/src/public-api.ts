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
export type { FsAlertTone } from './lib/alert/alert.component';

export * from './lib/experience-card/experience-card.component';
export type { FsExperienceCard, FsExperienceBadge } from './lib/experience-card/experience-card.component';

export * from './lib/profile-card/profile-card.component';
export type { FsProfileStat, FsProfileLink, FsProfileBadge } from './lib/profile-card/profile-card.component';

export { FsInputComponent } from './lib/input/input.component';
export type { FsInputType, FsInputState } from './lib/input/input.component';

export { FsAnchoredPopoverDirective } from './lib/overlay/anchored-popover.directive';
export type { FsPopoverAlign, FsPopoverSide } from './lib/overlay/anchored-popover.directive';

export { FsSelectComponent } from './lib/select/select.component';
export type { FsSelectOption, FsSelectState } from './lib/select/select.component';

export { FsDatePickerComponent } from './lib/date-picker/date-picker.component';
export type { FsDatePickerState, FsCalendarDay } from './lib/date-picker/date-picker.component';

export { FsDateRangePickerComponent } from './lib/date-picker/date-range-picker.component';
export type {
  FsDateRangePickerState,
  FsDateRange,
  FsDateRangePreset,
} from './lib/date-picker/date-range-picker.component';

export { FsOtpComponent } from './lib/otp/otp.component';
export type { FsOtpState, FsOtpMode } from './lib/otp/otp.component';

export { FsModalComponent } from './lib/dialog/modal.component';
export type { FsModalSize } from './lib/dialog/modal.component';

export { FsDrawerComponent } from './lib/dialog/drawer.component';
export type { FsDrawerSide } from './lib/dialog/drawer.component';

export { FsSliderComponent } from './lib/slider/slider.component';
export type { FsSliderState, FsSliderValuePosition } from './lib/slider/slider.component';

export { FsRatingComponent } from './lib/rating/rating.component';
export type { FsRatingState, FsRatingIcon } from './lib/rating/rating.component';

export { FsNumberInputComponent } from './lib/number-input/number-input.component';
export type { FsNumberInputState } from './lib/number-input/number-input.component';

export { FsTextareaComponent } from './lib/textarea/textarea.component';
export type { FsTextareaState, FsTextareaResize } from './lib/textarea/textarea.component';

export { FsFileUploadComponent, fsFormatFileSize } from './lib/file-upload/file-upload.component';
export type { FsFileUploadState, FsUploadFile, FsFileRejection } from './lib/file-upload/file-upload.component';

export { FsCheckboxComponent } from './lib/choice/checkbox.component';
export type { FsCheckboxState } from './lib/choice/checkbox.component';

export { FsRadioGroupComponent } from './lib/choice/radio-group.component';
export type { FsRadioOption } from './lib/choice/radio-group.component';

export { FsSwitchComponent } from './lib/choice/switch.component';

export { FsSegmentedComponent } from './lib/choice/segmented.component';
export type { FsSegmentOption } from './lib/choice/segmented.component';

export { FsToastService } from './lib/toast/toast.service';
export type { FsToastTone, FsToastItem, FsToastOptions } from './lib/toast/toast.service';
export { FsToastStackComponent } from './lib/toast/toast-stack.component';

export { FsTooltipComponent } from './lib/tooltip/tooltip.component';
export type { FsTooltipSide } from './lib/tooltip/tooltip.component';

export { FsHintComponent } from './lib/hint/hint.component';
export type { FsHintTone } from './lib/hint/hint.component';
export { FsFieldComponent } from './lib/hint/field.component';

export { FsMultiSelectComponent } from './lib/multi-select/multi-select.component';
export type { FsMultiSelectOption } from './lib/multi-select/multi-select.component';

export { FsStepsComponent } from './lib/steps/steps.component';
export type { FsStep } from './lib/steps/steps.component';

export { FsAccordionComponent } from './lib/accordion/accordion.component';
export type { FsAccordionItem, FsAccordionToggle } from './lib/accordion/accordion.component';

export { FsDividerComponent } from './lib/divider/divider.component';
export type {
  FsDividerOrientation,
  FsDividerVariant,
  FsDividerAlign,
} from './lib/divider/divider.component';

export { FsCardComponent } from './lib/card/card.component';
export type { FsCardTone } from './lib/card/card.component';

export { FsRowCardComponent } from './lib/card/row-card.component';

export { FsStatCardComponent } from './lib/card/stat-card.component';
export type { FsStatDeltaTone } from './lib/card/stat-card.component';

export { FsSkeletonComponent } from './lib/loading/skeleton.component';
export type { FsSkeletonVariant, FsSkeletonAnimation } from './lib/loading/skeleton.component';

export { FsSpinnerComponent } from './lib/loading/spinner.component';
export type { FsSpinnerSize } from './lib/loading/spinner.component';

export { FsProgressComponent } from './lib/loading/progress.component';
export type { FsProgressTone, FsProgressSize } from './lib/loading/progress.component';

export { FsCarouselComponent, FsCarouselSlideDirective } from './lib/carousel/carousel.component';
export type { FsCarouselSlideContext, FsCarouselCorners } from './lib/carousel/carousel.component';

export { FsBreadcrumbsComponent } from './lib/breadcrumbs/breadcrumbs.component';
export type { FsBreadcrumb, FsBreadcrumbNavigation } from './lib/breadcrumbs/breadcrumbs.component';
