import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { FsMultiSelectComponent } from './multi-select.component';

const meta: Meta<FsMultiSelectComponent> = {
  title: 'Components/MultiSelect',
  component: FsMultiSelectComponent,
  decorators: [
    moduleMetadata({
      imports: [FsMultiSelectComponent, FormsModule],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<FsMultiSelectComponent>;

const techs = [
  { value: 'angular',     label: 'Angular' },
  { value: 'react',       label: 'React' },
  { value: 'vue',         label: 'Vue' },
  { value: 'svelte',      label: 'Svelte' },
  { value: 'typescript',  label: 'TypeScript' },
  { value: 'node',        label: 'Node.js' },
  { value: 'nestjs',      label: 'NestJS' },
  { value: 'postgres',    label: 'PostgreSQL' },
];

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: () => ({
    props: { sel: ['angular', 'typescript'], options: techs },
    template: `
      <div style="max-width:380px;">
        <fs-multi-select
          placeholder="Seleccionar tecnologías..."
          [options]="options"
          [(ngModel)]="sel"
        ></fs-multi-select>
        <p style="margin-top:10px;font-size:12px;color:var(--fs-color-text-secondary)">
          Seleccionado: {{ sel | json }}
        </p>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Sin buscador ─────────────────────────────────────────────────────────────

export const NoSearch: Story = {
  name: 'Sin buscador',
  render: () => ({
    props: { sel: [], options: techs.slice(0, 5) },
    template: `
      <div style="max-width:380px;">
        <fs-multi-select
          placeholder="Seleccionar..."
          [options]="options"
          [searchable]="false"
          [(ngModel)]="sel"
        ></fs-multi-select>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Con límite ───────────────────────────────────────────────────────────────

export const WithMax: Story = {
  name: 'Con límite (max=3)',
  render: () => ({
    props: { sel: ['angular'], options: techs },
    template: `
      <div style="max-width:380px;">
        <fs-multi-select
          placeholder="Máximo 3 tecnologías..."
          [options]="options"
          [max]="3"
          [(ngModel)]="sel"
        ></fs-multi-select>
        <p style="margin-top:8px;font-size:12px;color:var(--fs-color-text-secondary)">
          {{ sel.length }}/3 seleccionados
        </p>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Deshabilitado ────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => ({
    props: { sel: ['angular', 'typescript'], options: techs },
    template: `
      <div style="max-width:380px;">
        <fs-multi-select
          [options]="options"
          [disabled]="true"
          [(ngModel)]="sel"
        ></fs-multi-select>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── Con categorías ───────────────────────────────────────────────────────────

export const FilterTags: Story = {
  name: 'Filtro de etiquetas',
  render: () => ({
    props: {
      sel: [],
      tags: [
        { value: 'design',     label: 'Diseño' },
        { value: 'frontend',   label: 'Frontend' },
        { value: 'backend',    label: 'Backend' },
        { value: 'devops',     label: 'DevOps' },
        { value: 'mobile',     label: 'Mobile' },
        { value: 'data',       label: 'Data' },
        { value: 'security',   label: 'Seguridad' },
      ],
    },
    template: `
      <div style="max-width:380px;">
        <fs-multi-select
          placeholder="Filtrar por categoría..."
          [options]="tags"
          [max]="4"
          [(ngModel)]="sel"
        ></fs-multi-select>
      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};

// ─── All variants ─────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  name: 'All variants',
  render: () => ({
    props: {
      s1: ['angular', 'typescript'],
      s2: [],
      s3: ['frontend'],
      options: techs,
      tags: [
        { value: 'frontend', label: 'Frontend' },
        { value: 'backend',  label: 'Backend' },
        { value: 'mobile',   label: 'Mobile' },
      ],
    },
    template: `
      <div style="display:flex;flex-direction:column;gap:20px;max-width:380px;">

        <div>
          <p style="font-size:12px;color:var(--fs-color-text-secondary);margin-bottom:6px">Con chips seleccionados</p>
          <fs-multi-select [options]="options" [(ngModel)]="s1"></fs-multi-select>
        </div>

        <div>
          <p style="font-size:12px;color:var(--fs-color-text-secondary);margin-bottom:6px">Sin búsqueda</p>
          <fs-multi-select [options]="options" [searchable]="false" [(ngModel)]="s2"></fs-multi-select>
        </div>

        <div>
          <p style="font-size:12px;color:var(--fs-color-text-secondary);margin-bottom:6px">Con límite max=2</p>
          <fs-multi-select [options]="tags" [max]="2" [(ngModel)]="s3"></fs-multi-select>
        </div>

        <div>
          <p style="font-size:12px;color:var(--fs-color-text-secondary);margin-bottom:6px">Deshabilitado</p>
          <fs-multi-select [options]="options" [disabled]="true" [(ngModel)]="s1"></fs-multi-select>
        </div>

      </div>
    `,
  }),
  parameters: { layout: 'padded' },
};
