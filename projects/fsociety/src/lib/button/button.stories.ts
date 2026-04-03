import type { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';
const meta: Meta<ButtonComponent> = {
  title:     'fsociety/Button',
  component: ButtonComponent,
  argTypes: {
    variant: { control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'] },
    size:    { control: 'radio',
      options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<ButtonComponent>;
export const Primary: Story = {
  args: { variant: 'primary', size: 'md', label: 'Guardar' }
};
