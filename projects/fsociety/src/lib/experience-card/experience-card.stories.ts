import type { Meta, StoryObj } from '@storybook/angular';
import { FsExperienceCardComponent } from './experience-card.component';

// ---------------------------------------------------------------------------
// Datos fake reutilizables
// ---------------------------------------------------------------------------

const EXPERIENCE_CURRENT = {
  company:   'Acme Corp',
  role:      'Senior Frontend Developer',
  startDate: 'mar 2022',
  current:   true,
  logoText:  'ACME',
  bullets: [
    'Desarrollo de interfaces con Angular 17+, migraciones de versiones anteriores.',
    'Configuración de pipelines CI/CD en AWS CodeBuild y ECS.',
    'Implementación de design system propio con tokens SCSS y componentes standalone.',
    'Automatización de tareas con scripts en Node.js.',
  ],
  bulletsPreview: 3,
  badges: [
    {
      label:   'Angular',
      color:   'danger' as const,
      imgLeft: 'https://cdn.simpleicons.org/angular/white',
    },
    {
      label:   'TypeScript',
      color:   'primary' as const,
      imgLeft: 'https://cdn.simpleicons.org/typescript/white',
    },
    {
      label:   'Node.js',
      color:   'success' as const,
      imgLeft: 'https://cdn.simpleicons.org/nodedotjs/white',
    },
    {
      label:       'AWS',
      customColor: '#ea580c',
      imgLeft:     'https://cdn.simpleicons.org/amazonaws/white',
    },
    { label: 'ESLint', color: 'neutral' as const },
    { label: 'Husky',  color: 'neutral' as const },
  ],
};

const EXPERIENCE_PAST = {
  company:   'Globex Solutions',
  role:      'Frontend Developer',
  startDate: 'jun 2020',
  endDate:   'feb 2022',
  logoText:  'GX',
  bullets: [
    'Desarrollo de componentes en Angular e Ionic para apps móviles.',
    'Integración con APIs REST y GraphQL.',
    'Participación en sprints ágiles con equipo distribuido.',
  ],
  badges: [
    {
      label:   'Angular',
      color:   'danger' as const,
      imgLeft: 'https://cdn.simpleicons.org/angular/white',
    },
    {
      label:   'Ionic',
      customColor: '#3880ff',
      imgLeft: 'https://cdn.simpleicons.org/ionic/white',
    },
    {
      label:   'JavaScript',
      color:   'warning' as const,
      imgLeft: 'https://cdn.simpleicons.org/javascript/white',
    },
    { label: 'Git', color: 'neutral' as const },
  ],
};

const EXPERIENCE_EARLY = {
  company:   'StartupXYZ',
  role:      'Frontend Developer Jr.',
  startDate: 'ene 2019',
  endDate:   'may 2020',
  logoText:  'XYZ',
  bullets: [
    'Primeros pasos en desarrollo web con Vue.js y JavaScript.',
    'Maquetado responsive con HTML/CSS y SCSS.',
  ],
  badges: [
    {
      label:       'Vue.js',
      customColor: '#22c55e',
      imgLeft:     'https://cdn.simpleicons.org/vuedotjs/white',
    },
    {
      label:   'JavaScript',
      color:   'warning' as const,
      imgLeft: 'https://cdn.simpleicons.org/javascript/white',
    },
    { label: 'SCSS', color: 'neutral' as const },
  ],
};

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<FsExperienceCardComponent> = {
  title:     'fsociety/Experience Card',
  component: FsExperienceCardComponent,
  tags:      ['autodocs'],
  argTypes: {
    variant: {
      control:     'radio',
      options:     ['full', 'compact'],
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
// Playground
// ---------------------------------------------------------------------------

export const Playground: Story = {
  name: 'Playground',
  args: {
    experience: EXPERIENCE_CURRENT,
    variant:    'full',
    timeline:   false,
  },
};

// ---------------------------------------------------------------------------
// Trabajo actual
// ---------------------------------------------------------------------------

export const Current: Story = {
  name: 'Trabajo actual — filled + dot verde',
  args: {
    experience: EXPERIENCE_CURRENT,
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
    experience: EXPERIENCE_PAST,
    variant:    'full',
    timeline:   false,
  },
};

// ---------------------------------------------------------------------------
// Variante compact
// ---------------------------------------------------------------------------

export const Compact: Story = {
  name: 'Variante compact — solo header',
  args: {
    experience: EXPERIENCE_CURRENT,
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
      current: EXPERIENCE_CURRENT,
      past:    EXPERIENCE_PAST,
      early:   EXPERIENCE_EARLY,
    },
    template: `
      <div style="display:flex; flex-direction:column; gap:16px; max-width:580px;">
        <fs-experience-card
          [experience]="current"
          variant="full"
          [timeline]="true"
          [timelineLast]="false"
        />
        <fs-experience-card
          [experience]="past"
          variant="full"
          [timeline]="true"
          [timelineLast]="false"
        />
        <fs-experience-card
          [experience]="early"
          variant="full"
          [timeline]="true"
          [timelineLast]="true"
        />
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Caso portfolio — dentro de contenedor
// ---------------------------------------------------------------------------

export const InPortfolio: Story = {
  name:   'En contexto portfolio',
  render: () => ({
    props: {
      current: EXPERIENCE_CURRENT,
      past:    EXPERIENCE_PAST,
      early:   EXPERIENCE_EARLY,
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
            <div style="font-size:15px; font-weight:600; color:#fff; margin-bottom:4px;">
              John Doe
            </div>
            <div style="font-size:12px; color:rgba(255,255,255,0.4);">
              Senior Frontend Developer
            </div>
          </div>
          <div style="padding:20px; display:flex; flex-direction:column; gap:16px;">
            <fs-experience-card [experience]="current" variant="full" [timeline]="true" [timelineLast]="false"/>
            <fs-experience-card [experience]="past"    variant="full" [timeline]="true" [timelineLast]="false"/>
            <fs-experience-card [experience]="early"   variant="full" [timeline]="true" [timelineLast]="true"/>
          </div>
        </div>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// Sin radius — full width
// ---------------------------------------------------------------------------

export const NoRadius: Story = {
  name: 'Sin redondeo — --fs-exp-radius: 0',
  render: () => ({
    props: { experience: EXPERIENCE_CURRENT },
    template: `
      <div style="--fs-exp-radius: 0">
        <fs-experience-card
          [experience]="experience"
          variant="full"
        />
      </div>
    `,
  }),
};
