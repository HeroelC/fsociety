import type { Meta, StoryObj } from '@storybook/angular';
import { FsProfileCardComponent } from './profile-card.component';

// ---------------------------------------------------------------------------
// Íconos SVG para links (viewBox 0 0 16 16, stroke paths)
// ---------------------------------------------------------------------------

const LINK_ICONS = {
  linkedin: 'M2 2h12v12H2V2zm2 9.5v-5h1.5v5H4zm.75-5.75a.875.875 0 1 1 0-1.75.875.875 0 0 1 0 1.75zM12 11.5H10.5V9.25c0-.56-.45-1-.1-1s-1 .44-1 1v2.25H8v-5h1.5v.67A2.1 2.1 0 0 1 11 6c1.1 0 1 .9 1 2v3.5z',
  github:   'M8 1C4.13 1 1 4.13 1 8c0 3.08 1.99 5.69 4.76 6.61.35.06.48-.15.48-.33v-1.3c-1.94.42-2.35-.94-2.35-.94-.32-.8-.77-1.02-.77-1.02-.63-.43.05-.42.05-.42.69.05 1.05.71 1.05.71.61 1.05 1.61.75 2 .57.06-.44.24-.75.43-.92-1.52-.17-3.12-.76-3.12-3.38 0-.75.27-1.36.71-1.84-.07-.17-.31-.87.07-1.82 0 0 .58-.18 1.9.71a6.6 6.6 0 0 1 1.74-.23c.59 0 1.18.08 1.74.23 1.32-.9 1.9-.71 1.9-.71.38.95.14 1.65.07 1.82.44.48.71 1.09.71 1.84 0 2.63-1.6 3.21-3.13 3.38.25.21.47.63.47 1.28v1.9c0 .18.12.4.48.33A7.02 7.02 0 0 0 15 8c0-3.87-3.13-7-7-7z',
  location: 'M8 1.5A4.5 4.5 0 0 0 3.5 6c0 3 4.5 8.5 4.5 8.5S12.5 9 12.5 6A4.5 4.5 0 0 0 8 1.5zm0 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z',
  globe:    'M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1.5c.5 0 1.2.8 1.7 2.5H6.3c.5-1.7 1.2-2.5 1.7-2.5zm-2.2.4C4.7 3.5 3.8 4.7 3.3 6H1.7a5.5 5.5 0 0 1 4.1-3.1zm4.4 0A5.5 5.5 0 0 1 14.3 6h-1.6c-.5-1.3-1.4-2.5-2.5-3.1zM1.5 7.5h2c-.1.5-.1 1-.1 1.5s0 1 .1 1.5h-2a5.5 5.5 0 0 1 0-3zm2.5 0h4v3h-4a9.7 9.7 0 0 1 0-3zm5.5 0h4a5.5 5.5 0 0 1 0 3H9.5a11.5 11.5 0 0 0 0-3zm-7.3 4h1.6c.5 1.3 1.4 2.5 2.5 3.1A5.5 5.5 0 0 1 2.2 11.5zm8.1 0h1.6a5.5 5.5 0 0 1-4.1 3.1c1.1-.6 2-1.8 2.5-3.1zM6.3 12h3.4c-.5 1.7-1.2 2.5-1.7 2.5s-1.2-.8-1.7-2.5z',
};

// ---------------------------------------------------------------------------
// Íconos de tech (viewBox 0 0 24 24, fill paths)
// ---------------------------------------------------------------------------

const TECH_ICONS = {
  angular: 'M9.931 12.645h4.138l-2.07-4.908m0-7.737L.68 3.982l1.726 18.091 9.525 2.642 9.523-2.642L23.32 3.982zM17.593 18.76H15.88l-1.02-2.527H9.148l-1.021 2.527H6.405l4.913-11.914h1.876z',
  aws:     'M18.75 0h-4.5L12 2.25 9.75 0h-4.5L0 12l5.25 12h4.5L12 21.75 14.25 24h4.5L24 12zm-6.75 18l-1.5-1.5-1.5 1.5-3-6.75L9 9l3 3 3-3 3 2.25z',
};

// ---------------------------------------------------------------------------
// Datos de Heroel — caso portfolio real
// ---------------------------------------------------------------------------

const HEROEL_PROFILE = {
  name:     'Heroel Carpinetti',
  handle:   'heroelc',
  role:     'Frontend Developer Angular',
  verified: true,

  // Para usar tu foto real:
  // avatarUrl: 'https://avatars.githubusercontent.com/u/TU_ID',

  // Para usar una imagen de banner:
  // bannerUrl: 'https://...',

  links: [
    { label: 'linkedin.com/in/heroelc', url: 'https://linkedin.com/in/heroelc', icon: LINK_ICONS.linkedin },
    { label: 'github.com/heroelc',      url: 'https://github.com/heroelc',      icon: LINK_ICONS.github   },
    { label: 'Tandil, Buenos Aires',    icon: LINK_ICONS.location },
  ],

  badges: [
    { label: 'Angular',    color: 'danger'    as const, iconLeft: TECH_ICONS.angular },
    { label: 'TypeScript', color: 'primary'   as const },
    { label: 'AWS',        color: 'secondary' as const, iconLeft: TECH_ICONS.aws },
  ],

  stats: [
    { value: '4+',  label: 'años exp.' },
    { value: '12',  label: 'proyectos' },
    { value: '985', label: 'seguidores' },
  ],
};

const meta: Meta<FsProfileCardComponent> = {
  title:     'fsociety/Profile Card',
  component: FsProfileCardComponent,
  tags:      ['autodocs'],
  argTypes: {
    showActions: {
      control:     'boolean',
      description: 'false = readonly/portfolio · true = con botones Seguir/Mensaje',
    },
    verified: {
      control: 'boolean',
      description: 'Muestra el badge de verificado sobre el avatar',
    },
    avatarUrl: {
      control:     'text',
      description: 'URL de la foto de perfil. Sin valor → muestra iniciales.',
    },
    bannerUrl: {
      control:     'text',
      description: 'URL de imagen para el banner. Sin valor → usa degradé navy.',
    },
    primaryAction:   { action: 'primaryAction' },
    secondaryAction: { action: 'secondaryAction' },
  },
};

export default meta;
type Story = StoryObj<FsProfileCardComponent>;

// ---------------------------------------------------------------------------
// Readonly — portfolio propio (sin acciones)
// ---------------------------------------------------------------------------

export const Portfolio: Story = {
  name: 'Portfolio — readonly',
  args: {
    ...HEROEL_PROFILE,
    showActions: false,
  },
};

// ---------------------------------------------------------------------------
// Con acciones — perfil de otro usuario
// ---------------------------------------------------------------------------

export const WithActions: Story = {
  name: 'Con acciones — seguir / mensaje',
  args: {
    ...HEROEL_PROFILE,
    showActions:           true,
    primaryActionLabel:    'Seguir',
    secondaryActionLabel:  'Mensaje',
  },
};

// ---------------------------------------------------------------------------
// Con avatar URL — foto de GitHub
// ---------------------------------------------------------------------------

export const WithAvatarUrl: Story = {
  name: 'Con avatarUrl — foto de GitHub',
  args: {
    ...HEROEL_PROFILE,
    showActions: false,
    // Reemplazá con el ID real de tu cuenta GitHub
    avatarUrl: 'https://avatars.githubusercontent.com/u/9919?v=4',
  },
  parameters: {
    docs: {
      description: {
        story: `
Pasá la URL de tu foto de GitHub en \`avatarUrl\`:
\`\`\`html
<fs-profile-card
  avatarUrl="https://avatars.githubusercontent.com/u/TU_ID"
/>
\`\`\`
Para obtener tu ID: abrí \`https://api.github.com/users/heroelc\` y buscá el campo \`id\`.
        `,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Con banner URL
// ---------------------------------------------------------------------------

export const WithBannerUrl: Story = {
  name: 'Con bannerUrl — imagen de fondo',
  args: {
    ...HEROEL_PROFILE,
    showActions: false,
    bannerUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&q=80',
  },
  parameters: {
    docs: {
      description: {
        story: `
Pasá cualquier URL de imagen en \`bannerUrl\`:
\`\`\`html
<fs-profile-card
  bannerUrl="https://tu-imagen.com/banner.jpg"
/>
\`\`\`
Sin \`bannerUrl\`, el componente usa el degradé navy por defecto.
        `,
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Stats personalizados
// ---------------------------------------------------------------------------

export const CustomStats: Story = {
  name: 'Stats configurables',
  args: {
    ...HEROEL_PROFILE,
    showActions: false,
    stats: [
      { value: '4+',  label: 'años exp.' },
      { value: '16',  label: 'repos' },
      { value: '1.2k',label: 'commits' },
      { value: '8',   label: 'libs' },
    ],
  },
};

// ---------------------------------------------------------------------------
// Sin stats
// ---------------------------------------------------------------------------

export const NoStats: Story = {
  name: 'Sin stats footer',
  args: {
    ...HEROEL_PROFILE,
    showActions: false,
    stats:       [],
  },
};

// ---------------------------------------------------------------------------
// Uso en tu portfolio — ejemplo completo con código
// ---------------------------------------------------------------------------

export const UsageExample: Story = {
  name: 'Ejemplo de uso — portfolio Angular',
  render: () => ({
    template: `
      <div style="max-width:300px;">
        <fs-profile-card
          name="Heroel Carpinetti"
          handle="heroelc"
          role="Frontend Developer Angular"
          [verified]="true"
          [showActions]="false"
          [links]="links"
          [badges]="badges"
          [stats]="stats"
        />
      </div>
    `,
    props: {
      links: HEROEL_PROFILE.links,
      badges: HEROEL_PROFILE.badges,
      stats: HEROEL_PROFILE.stats,
    },
  }),
  parameters: {
    docs: {
      description: {
        story: `
\`\`\`typescript
// profile.component.ts
import { FsProfileCardComponent } from '@heroelc/fsociety';

@Component({
  standalone: true,
  imports: [FsProfileCardComponent],
  template: \`
    <fs-profile-card
      name="Heroel Carpinetti"
      handle="heroelc"
      role="Frontend Developer Angular"
      avatarUrl="https://avatars.githubusercontent.com/u/TU_ID"
      [verified]="true"
      [showActions]="false"
      [links]="links"
      [badges]="badges"
      [stats]="stats"
    />
  \`
})
export class ProfileComponent {
  links = [
    { label: 'linkedin.com/in/heroelc', url: 'https://linkedin.com/in/heroelc' },
    { label: 'github.com/heroelc',      url: 'https://github.com/heroelc' },
    { label: 'Tandil, Buenos Aires' },
  ];

  badges = [
    { label: 'Angular',    color: 'danger'    },
    { label: 'TypeScript', color: 'primary'   },
    { label: 'AWS',        color: 'secondary' },
  ];

  stats = [
    { value: '4+', label: 'años exp.' },
    { value: '12', label: 'proyectos' },
  ];
}
\`\`\`
        `,
      },
    },
  },
};
