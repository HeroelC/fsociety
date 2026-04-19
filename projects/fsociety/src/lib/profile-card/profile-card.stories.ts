import type { Meta, StoryObj } from '@storybook/angular';
import { FsProfileCardComponent } from './profile-card.component';

const meta: Meta<FsProfileCardComponent> = {
  title:     'fsociety/ProfileCard',
  component: FsProfileCardComponent,
  tags:      ['autodocs'],
  argTypes: {
    verified:    { control: 'boolean' },
    showActions: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<FsProfileCardComponent>;

// ---------------------------------------------------------------------------
// Datos fake reutilizables
// ---------------------------------------------------------------------------

const FAKE_LINKS = [
  {
    label:  'linkedin.com/in/johndoe',
    url:    'https://linkedin.com/in/johndoe',
    imgUrl: 'https://cdn.simpleicons.org/linkedin/white',
    imgAlt: 'LinkedIn',
  },
  {
    label:  'github.com/johndoe',
    url:    'https://github.com/johndoe',
    imgUrl: 'https://cdn.simpleicons.org/github/white',
    imgAlt: 'GitHub',
  },
  {
    label: 'Buenos Aires, Argentina',
    icon:  'M8 1.5A4.5 4.5 0 0 0 3.5 6c0 3 4.5 8.5 4.5 8.5S12.5 9 12.5 6A4.5 4.5 0 0 0 8 1.5zm0 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z',
  },
];

const FAKE_BADGES = [
  { label: 'Angular',    color: 'danger'  as const, imgLeft: 'https://cdn.simpleicons.org/angular/white' },
  { label: 'TypeScript', color: 'primary' as const, imgLeft: 'https://cdn.simpleicons.org/typescript/white' },
  { label: 'AWS',        customColor: '#ea580c',    imgLeft: 'https://cdn.simpleicons.org/amazonaws/white' },
  { label: 'NestJS',     customColor: '#7c3aed',    imgLeft: 'https://cdn.simpleicons.org/nestjs/white' },
];

const FAKE_STATS = [
  { value: '5+', label: 'años exp.' },
  { value: '18', label: 'proyectos' },
];

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export const Playground: Story = {
  args: {
    name:       'John Doe',
    handle:     'johndoe',
    role:       'Frontend Developer',
    verified:   true,
    avatarUrl:  'https://i.pravatar.cc/150?img=8',
    bannerUrl:  'https://picsum.photos/seed/fsociety/800/200',
    links:      FAKE_LINKS,
    badges:     FAKE_BADGES,
    stats:      FAKE_STATS,
    showActions: false,
  },
};

// ---------------------------------------------------------------------------
// Con imagen de banner y avatar
// ---------------------------------------------------------------------------

export const WithImages: Story = {
  name: 'Con avatarUrl y bannerUrl',
  args: {
    name:      'Jane Smith',
    handle:    'janesmith',
    role:      'Full Stack Developer',
    verified:  true,
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
    bannerUrl: 'https://picsum.photos/seed/banner1/800/200',
    links:     FAKE_LINKS,
    badges:    FAKE_BADGES,
    stats:     FAKE_STATS,
  },
};

// ---------------------------------------------------------------------------
// Sin imagen — solo iniciales y degradé
// ---------------------------------------------------------------------------

export const WithInitials: Story = {
  name: 'Sin imágenes — iniciales + degradé',
  args: {
    name:    'Alex Rivera',
    handle:  'alexrivera',
    role:    'Frontend Developer',
    verified: false,
    links:   FAKE_LINKS,
    badges:  [
      { label: 'Vue.js',  customColor: '#22c55e' },
      { label: 'Python',  customColor: '#3b82f6' },
      { label: 'Docker',  color: 'neutral' as const },
    ],
    stats: FAKE_STATS,
  },
};

// ---------------------------------------------------------------------------
// Con acciones
// ---------------------------------------------------------------------------

export const WithActions: Story = {
  name: 'Con botones de acción',
  args: {
    name:        'Sam Taylor',
    handle:      'samtaylor',
    role:        'UI/UX Engineer',
    verified:    true,
    avatarUrl:   'https://i.pravatar.cc/150?img=12',
    bannerUrl:   'https://picsum.photos/seed/banner2/800/200',
    links:       FAKE_LINKS,
    badges:      FAKE_BADGES,
    stats:       FAKE_STATS,
    showActions: true,
    primaryActionLabel:   'Seguir',
    secondaryActionLabel: 'Mensaje',
  },
};

// ---------------------------------------------------------------------------
// Sin radius — full width
// ---------------------------------------------------------------------------

export const NoRadius: Story = {
  name: 'Sin redondeo — full width',
  render: () => ({
    template: `
      <div style="--fs-profile-radius: 0">
        <fs-profile-card
          name="Chris Morgan"
          handle="chrismorgan"
          role="Backend Developer"
          avatarUrl="https://i.pravatar.cc/150?img=33"
          bannerUrl="https://picsum.photos/seed/banner3/800/200"
          [verified]="true"
          [links]="links"
          [badges]="badges"
          [stats]="stats"
        />
      </div>
    `,
    props: {
      links:  FAKE_LINKS,
      badges: FAKE_BADGES,
      stats:  FAKE_STATS,
    },
  }),
};
