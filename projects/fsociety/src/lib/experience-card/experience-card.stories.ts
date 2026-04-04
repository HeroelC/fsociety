import type { Meta, StoryObj } from '@storybook/angular';
import { FsExperienceCardComponent } from './experience-card.component';

// SVG paths de íconos de tech
const ICONS = {
  angular:  'M9.931 12.645h4.138l-2.07-4.908m0-7.737L.68 3.982l1.726 18.091 9.525 2.642 9.523-2.642L23.32 3.982zM17.593 18.76H15.88l-1.02-2.527H9.148l-1.021 2.527H6.405l4.913-11.914h1.876z',
  js:       'M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179v-.056z',
  node:     'M11.998 24c-.321 0-.641-.084-.924-.251L8.054 21.99c-.435-.243-.223-.329-.079-.378.441-.153.530-.187.995-.453.049-.028.114-.017.165.012l2.308 1.371c.079.043.191.043.266 0l8.991-5.19c.081-.047.134-.142.134-.238V6.921c0-.099-.053-.19-.137-.241L11.706 1.5c-.079-.046-.188-.046-.271 0L2.449 6.68c-.085.052-.139.143-.139.241v10.37c0 .096.054.189.137.236l2.462 1.422c1.338.669 2.154-.119 2.154-.914V7.205c0-.147.116-.261.262-.261h1.148c.143 0 .261.114.261.261v10.83c0 1.789-.975 2.815-2.671 2.815-.521 0-.932 0-2.079-.565L1.355 19.01c-.571-.329-.924-.940-.924-1.598V7.205c0-.659.353-1.273.924-1.598L10.351.416c.557-.320 1.296-.320 1.848 0l8.998 5.191c.571.325.924.939.924 1.598v10.207c0 .659-.353 1.274-.924 1.598l-8.998 5.19c-.283.168-.602.251-.921.251z',
  aws:      'M18.75 0h-4.5L12 2.25 9.75 0h-4.5L0 12l5.25 12h4.5L12 21.75 14.25 24h4.5L24 12zm-6.75 18l-1.5-1.5-1.5 1.5-3-6.75L9 9l3 3 3-3 3 2.25z',
};

const XCALE_EXPERIENCE = {
  company:      'Xcale Consulting',
  role:         'Frontend Developer',
  startDate:    'abr 2022',
  current:      true,
  logoText:     'X CALE',
  bullets: [
    'Desarrollo de interfaces con Angular, migraciones de versión 8 a la 16.',
    'Configuración de pipelines, CodeBuild, ECS en AWS y trabajo con S3 buckets.',
    'Desarrollé pequeños scripts en Node.js para automatización de tareas.',
    'Configuré y trabajé con Angular Material, FontAwesome, ESLint y Husky.',
  ],
  bulletsPreview: 3,
  badges: [
    { label: 'Angular',     color: 'danger'    as const, iconLeft: ICONS.angular },
    { label: 'TypeScript',  color: 'primary'   as const },
    { label: 'JavaScript',  color: 'warning'   as const, iconLeft: ICONS.js },
    { label: 'Node.js',     color: 'success'   as const, iconLeft: ICONS.node },
    { label: 'AWS',         color: 'secondary' as const, iconLeft: ICONS.aws },
    { label: 'ESLint',      color: 'neutral'   as const },
    { label: 'Husky',       color: 'neutral'   as const },
  ],
};

const PREV_EXPERIENCE = {
  company:   'Empresa anterior',
  role:      'Frontend Developer Jr.',
  startDate: 'ene 2020',
  endDate:   'mar 2022',
  logoText:  'PREV',
  bullets: [
    'Desarrollo de componentes en React y Vue.js.',
    'Integración con APIs REST y GraphQL.',
  ],
  badges: [
    { label: 'JavaScript', color: 'warning' as const, iconLeft: ICONS.js },
    { label: 'React',      color: 'neutral' as const },
    { label: 'Vue.js',     color: 'neutral' as const },
  ],
};

const meta: Meta<FsExperienceCardComponent> = {
  title:     'fsociety/Experience Card',
  component: FsExperienceCardComponent,
  tags:      ['autodocs'],
  argTypes: {
    variant: {
      control:  'radio',
      options:  ['full', 'compact'],
      description: 'full = con bullets y badges · compact = solo header',
    },
    timeline: {
      control:     'boolean',
      description: 'Muestra línea y dot de timeline a la izquierda',
    },
    timelineLast: {
      control:     'boolean',
      description: 'Último item del timeline — oculta la línea hacia abajo',
    },
  },
};

export default meta;
type Story = StoryObj<FsExperienceCardComponent>;

// ---------------------------------------------------------------------------
// Trabajo actual — variante full
// ---------------------------------------------------------------------------

export const Current: Story = {
  name: 'Trabajo actual — full',
  args: {
    experience: XCALE_EXPERIENCE,
    variant:    'full',
    timeline:   false,
  },
};

// ---------------------------------------------------------------------------
// Trabajo pasado
// ---------------------------------------------------------------------------

export const Past: Story = {
  name: 'Trabajo pasado',
  args: {
    experience: PREV_EXPERIENCE,
    variant:    'full',
    timeline:   false,
  },
};

// ---------------------------------------------------------------------------
// Variante compact
// ---------------------------------------------------------------------------

export const Compact: Story = {
  name: 'Variante compact',
  args: {
    experience: XCALE_EXPERIENCE,
    variant:    'compact',
    timeline:   false,
  },
};

// ---------------------------------------------------------------------------
// Timeline — múltiples experiencias encadenadas
// ---------------------------------------------------------------------------

export const Timeline: Story = {
  name:   'Timeline — múltiples experiencias',
  render: () => ({
    props: {
      xcale: XCALE_EXPERIENCE,
      prev:  PREV_EXPERIENCE,
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:16px; max-width:580px;">
        <fs-experience-card
          [experience]="xcale"
          variant="full"
          [timeline]="true"
          [timelineLast]="false"
        />
        <fs-experience-card
          [experience]="prev"
          variant="full"
          [timeline]="true"
          [timelineLast]="true"
        />
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Portfolio completo — dentro de tabs
// ---------------------------------------------------------------------------

export const InTabs: Story = {
  name:   'Dentro de fs-tabs — caso portfolio',
  render: () => ({
    props: {
      xcale: XCALE_EXPERIENCE,
      prev:  PREV_EXPERIENCE,
    },
    template: `
      <div style="max-width:600px;">
        <div style="
          background:#0d1117;
          border-radius:12px;
          overflow:hidden;
          border:0.5px solid rgba(255,255,255,0.08);
        ">
          <div style="padding:20px 20px 0;">
            <div style="font-size:15px;font-weight:600;color:#fff;margin-bottom:4px;">
              Heroel Carpinetti
            </div>
            <div style="font-size:12px;color:rgba(255,255,255,0.4);">
              Frontend Developer Angular
            </div>
          </div>
          <div style="padding:20px; display:flex; flex-direction:column; gap:16px;">
            <fs-experience-card [experience]="xcale" variant="full" [timeline]="true" [timelineLast]="false"/>
            <fs-experience-card [experience]="prev"  variant="full" [timeline]="true" [timelineLast]="true"/>
          </div>
        </div>
      </div>
    `,
  }),
};
