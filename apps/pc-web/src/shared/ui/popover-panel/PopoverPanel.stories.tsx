import { Button, Popover, PopoverTrigger } from '@bx/shared';

import { PopoverPanel } from './PopoverPanel';

export default {
  title: 'UI/PopoverPanel',
  component: PopoverPanel,
  parameters: {
    layout: 'centered',
  },
};

export const Default = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <Button variant="secondary">Open panel</Button>
      </PopoverTrigger>
      <PopoverPanel title="Account settings">
        <p style={{ margin: 0 }}>Popover content rendered with the PC theme.</p>
      </PopoverPanel>
    </Popover>
  ),
};
