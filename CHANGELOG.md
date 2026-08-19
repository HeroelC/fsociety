# Changelog

## [0.12.0](https://github.com/heroelc/fsociety/compare/v0.11.0...v0.12.0) (2026-08-19)

### Features

* **breadcrumbs:** add fs-breadcrumbs ([4ccd8ef](https://github.com/heroelc/fsociety/commit/4ccd8ef65ddd41cc66264289c87903d60ebec7b6))
* **carousel:** let the rounded corners be chosen ([8ee8d67](https://github.com/heroelc/fsociety/commit/8ee8d67df2283e43eeecdc3dce8dd332e70ae43a))
* let every component with an outer box choose its corners ([18a8985](https://github.com/heroelc/fsociety/commit/18a89859be5e35c3593dd92a4fc51457fb7e86d1))

### Bug Fixes

* **carousel:** make the custom properties actually overridable ([043376f](https://github.com/heroelc/fsociety/commit/043376fadf7ce3e042f37a73e093cd96b2bcc3df))
* **styles:** let every component's custom properties be overridden ([1941c9f](https://github.com/heroelc/fsociety/commit/1941c9f5bcfe31f0fb08820d32674ed47013818a))

## [0.11.0](https://github.com/heroelc/fsociety/compare/v0.10.0...v0.11.0) (2026-08-19)

### Features

* **segmented:** add a valueChange output ([c29c7dd](https://github.com/heroelc/fsociety/commit/c29c7dd723c6b47d867b08d64a635b8ccf19c4ba))

### Bug Fixes

* **dialog:** measure in dvh, expose the drawer cap, clear the safe area ([3cab6bf](https://github.com/heroelc/fsociety/commit/3cab6bf2ef4473fe12b12ea2773168d24bf4cf8e))
* **tokens:** let data-theme be the only thing that picks a theme ([5edf1fe](https://github.com/heroelc/fsociety/commit/5edf1fe71decca876d9c4a2591dce41b4bfbaacf))
* **tokens:** serve the real dark palette to [data-theme=dark] ([84265ed](https://github.com/heroelc/fsociety/commit/84265ed17a90257611581a0e188b99bb5ff4b3da))

## [0.10.0](https://github.com/heroelc/fsociety/compare/v0.9.0...v0.10.0) (2026-08-19)

### Features

* **carousel:** add fs-carousel on native scroll-snap ([fdece75](https://github.com/heroelc/fsociety/commit/fdece75509c9b7d8a838e0dee0a8f7568738f2c2))

## [0.9.0](https://github.com/heroelc/fsociety/compare/v0.8.0...v0.9.0) (2026-08-17)

### Features

* **loading:** add fs-skeleton, fs-spinner and fs-progress ([e4765c6](https://github.com/heroelc/fsociety/commit/e4765c6c109a8d23574ce0d742ba8a1e7b9012ca))

## [0.8.0](https://github.com/heroelc/fsociety/compare/v0.7.0...v0.8.0) (2026-08-08)

### Features

* **accordion:** add fs-accordion with a measured-free height animation ([7db6448](https://github.com/heroelc/fsociety/commit/7db64481b670528575d6c7d289d6e632699c0648))
* **card:** add fs-card, fs-row-card and fs-stat-card ([36d02cc](https://github.com/heroelc/fsociety/commit/36d02cceedff20d8457bfe6bd9344614b923b66e))
* **dialog:** add fs-modal and fs-drawer on native dialog ([8d7135e](https://github.com/heroelc/fsociety/commit/8d7135edfb0b4ba791316f1a6c8cf099c58509bd))
* **divider:** add fs-divider ([934129a](https://github.com/heroelc/fsociety/commit/934129a8922e66d45cf5b63e572f42d6ea30d7bd))

### Bug Fixes

* **drawer:** only lay out the dialog while it is open ([fe752e5](https://github.com/heroelc/fsociety/commit/fe752e5f5037b87903a568b3b46060525d1b9169))

## [0.7.0](https://github.com/heroelc/fsociety/compare/v0.6.0...v0.7.0) (2026-08-07)

### Features

* **rating:** add a star rating with a readonly fractional mode ([f18f964](https://github.com/heroelc/fsociety/commit/f18f964cba496752075ff9f0fc44cf4b348b18fe))
* **slider:** add a range control ([d0cef98](https://github.com/heroelc/fsociety/commit/d0cef98335d3dab75e80d8dee0df6ad8e88f1ff3))

## [0.6.0](https://github.com/heroelc/fsociety/compare/v0.5.0...v0.6.0) (2026-08-07)

### Features

* **date-range-picker:** add a two-month range calendar ([ba1dfcd](https://github.com/heroelc/fsociety/commit/ba1dfcd77360e8cb4fa9ef298a93ec973eb86d9d))
* **otp:** add a verification code field ([57506cc](https://github.com/heroelc/fsociety/commit/57506ccd22bb45718dc57a060f32d4ea4688005a))

## [0.5.0](https://github.com/heroelc/fsociety/compare/v0.4.0...v0.5.0) (2026-08-07)

### Features

* **file-upload:** add a dropzone that keeps the real File objects ([e5388ff](https://github.com/heroelc/fsociety/commit/e5388ff3ab22de1d322ff64135227cba4230bd2d))
* **number-input:** add a stepper number field ([590f6f3](https://github.com/heroelc/fsociety/commit/590f6f34d70de32c2eff4704c1e987835b6cada5))
* **textarea:** add a textarea with counter and auto-grow ([10d88f8](https://github.com/heroelc/fsociety/commit/10d88f831374526fa4075175a0eab5aac5584a79))

## [0.4.0](https://github.com/heroelc/fsociety/compare/v0.3.0...v0.4.0) (2026-08-07)

### Features

* **date-picker:** add a typeable date field with a calendar ([9f99d49](https://github.com/heroelc/fsociety/commit/9f99d498780d8bc0ee76c0428521d45189ff5251))

### Bug Fixes

* **date-picker:** guard inputs so an unset binding cannot leak into the DOM ([d49154c](https://github.com/heroelc/fsociety/commit/d49154c69e2f8a5cd8288162bb5e934d3408d7c4))
* **release:** strip hex colours from changelog refs, and fix the band guard ([c97c85b](https://github.com/heroelc/fsociety/commit/c97c85b68504f4baa051750c28a9ba48482f43c7))

## [0.3.0](https://github.com/heroelc/fsociety/compare/v0.2.0...v0.3.0) (2026-08-07)

### Features

* **overlay:** export the popover align and side types ([13755a8](https://github.com/heroelc/fsociety/commit/13755a879545c9a127a5c338fb79448706b47650))
* **storybook:** add a live brand palette playground ([da9288f](https://github.com/heroelc/fsociety/commit/da9288fd5ee64365f2855d3ce804882a4b59139b))

### Bug Fixes

* **badge,profile-card:** tint icons with currentColor instead of using img ([7dfbe43](https://github.com/heroelc/fsociety/commit/7dfbe430ef190ef29c53f8c2c191ddc405ffff2f))
* **badge:** make customColor readable, and let the theme flip it ([82f821b](https://github.com/heroelc/fsociety/commit/82f821b000ebe97e87fa52d339ad6b56a266f632))
* **docs:** use colour-agnostic icon URLs and drop the dead LinkedIn slug ([02b2264](https://github.com/heroelc/fsociety/commit/02b2264be92047129160aff7bb6d935950bc9495))

## [0.2.0](https://github.com/heroelc/fsociety/compare/v0.1.0...v0.2.0) (2026-08-07)

### Bug Fixes

* **alert:** space the action buttons when they share a wrapper ([f59d488](https://github.com/heroelc/fsociety/commit/f59d48801bd1022a77dc4133fb6dbbab4f80201c))
* **overlay:** move the tooltip and the toast stack to the top layer ([05c49ff](https://github.com/heroelc/fsociety/commit/05c49ff1e0d04174bca6e0cf8fe5fb3903113433))
* **styles:** give focus-ring one implementation and fix its inner ring ([f36d1f9](https://github.com/heroelc/fsociety/commit/f36d1f927982a461eca73c87d8d167db4f2eadab))
* **styles:** make the semantic token layer reachable for consumers ([4e48051](https://github.com/heroelc/fsociety/commit/4e480517f73cb4bfd6366651b60466cf14afdebc))
* **styles:** stop fs-* elements overflowing their container ([fcfc8a4](https://github.com/heroelc/fsociety/commit/fcfc8a4f6ce4ff0e6d90ce5a0e98c914d02cf76d))

## [0.1.0](https://github.com/heroelc/fsociety/compare/0.0.18...v0.1.0) (2026-08-07)

### Features

* **overlay:** render dropdowns in the browser top layer ([9da4e9e](https://github.com/heroelc/fsociety/commit/9da4e9e467a77536e8e6a29726229e2332912964))
* version 0.0.18 ([0246954](https://github.com/heroelc/fsociety/commit/0246954cc6a580775d8186145332c3578508dde2))

### Bug Fixes

* **docs:** restore the mixins demos and document the overlay mixins ([eb61589](https://github.com/heroelc/fsociety/commit/eb61589d64d90191840ee7e69c18f59f4e5b1904))
* **release:** read the release-it config and sync the lib version in one commit ([14f590d](https://github.com/heroelc/fsociety/commit/14f590d451fe1cde4a80d3663b9267a1f6678dca))
* **storybook:** make Docs pages follow the active theme ([d852193](https://github.com/heroelc/fsociety/commit/d8521932a4510db78468c336fbdc55a088258322))
* **theme:** drive component colors from the semantic tokens ([fb5b3d3](https://github.com/heroelc/fsociety/commit/fb5b3d38c716b1ff920548df01adbd04e1e513e8))

## 0.0.18 (2026-05-30)

### Features

* update documentation ([fee1c3e](https://github.com/heroelc/fsociety/commit/fee1c3eeffcd187134e0e0a7d16d639b598b9e73))

## 0.0.17 (2026-05-30)

### Features

* add toast, tooltip and alert update ([26d463b](https://github.com/heroelc/fsociety/commit/26d463b4d9b8c8350c7757ca61117ddb49a40a71))
* hint, multi selection y steps ([bdf6792](https://github.com/heroelc/fsociety/commit/bdf679268560d002df29a921b86d4795182b6fba))
* Version 0.0.16 ([f8e0898](https://github.com/heroelc/fsociety/commit/f8e0898380db3f8732a8a688e3caf44644e6bf67))

## 0.0.16 (2026-05-29)

### Features

* Add inputs, new buttons and selects ([77677fc](https://github.com/heroelc/fsociety/commit/77677fc0ba23b2efe48bb0be0b53ba0e1022d571))

## 0.0.15 (2026-04-24)

### Bug Fixes

* **email:** add handleLinkClick for obfuscate email ([693dc42](https://github.com/heroelc/fsociety/commit/693dc425c70cf7a22ee696012a4877c9e0243155))

## 0.0.14 (2026-04-24)

### Bug Fixes

* Add new encript in mail ProfileCard ([0d3b083](https://github.com/heroelc/fsociety/commit/0d3b083e8b13cfa38a7a5b0d9a0c8b9200aed42a))

## 0.0.13 (2026-04-24)

### Bug Fixes

* email in ProfileCard encoded ([1979f23](https://github.com/heroelc/fsociety/commit/1979f23f7e7bbcb157b6a2374ccbb496ceb81a79))
* **version:** ajust version 0.0.12 ([d0a02e6](https://github.com/heroelc/fsociety/commit/d0a02e65785c1cdca8ff8bd6b3842c2283c7f804))

## 0.0.12 (2026-04-19)

### Features

* add customColor and imgLeft to badge, imgUrl to profile links ([98c7b97](https://github.com/heroelc/fsociety/commit/98c7b970e5805d2f8ba4ad2a435924ac9f3574c4))

### Bug Fixes

* package lib 0.0.11 ([769191d](https://github.com/heroelc/fsociety/commit/769191dbb674db2d42c331e2a2e9253ed0b1bc35))

## 0.0.11 (2026-04-07)

### Bug Fixes

* Add README for NPM ([6848051](https://github.com/heroelc/fsociety/commit/6848051f71251c14ba229e2135e6b2b98a57b82e))

## 0.0.10 (2026-04-07)

### Bug Fixes

* change badge svg icon a img icon ([d2405ad](https://github.com/heroelc/fsociety/commit/d2405adb3e617c0a5200ea7494b93689b7d31d3f))

## 0.0.9 (2026-04-06)

### Bug Fixes

* sass deprecation warnings and mixins improvements ([433f0d5](https://github.com/heroelc/fsociety/commit/433f0d5c401a75e17fb81fa3d3e5ba00985e51a3))

## 0.0.8 (2026-04-06)

### Bug Fixes

* mixins fix story book, export global.scss mixins ([1ca523e](https://github.com/heroelc/fsociety/commit/1ca523e7160d7e56083d3314284d19e22718df5f))

## 0.0.7 (2026-04-06)

### Bug Fixes

* update components styles and add mixins ([f9256fb](https://github.com/heroelc/fsociety/commit/f9256fb4d55c58d91b33cbbb607cfb5dfef979e2))
* update version ([6749b91](https://github.com/heroelc/fsociety/commit/6749b91e097ceaff802d9c6492e5b8d7e03dac83))

## 0.0.6 (2026-04-05)

### Bug Fixes

* update profile, experience, badge and buttons ([60a3551](https://github.com/heroelc/fsociety/commit/60a3551254f773b9986fe4d649ce8b02adcd46b1))

## 0.0.5 (2026-04-05)

## 0.0.4 (2026-04-05)

## 0.0.3 (2026-04-05)

## 0.0.2 (2026-04-05)
