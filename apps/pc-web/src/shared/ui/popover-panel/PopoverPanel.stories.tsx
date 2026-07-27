import { Button, Popover, PopoverTrigger } from '@bx/shared';

import { PopoverPanel } from './PopoverPanel';
import styles from './PopoverPanel.stories.module.css';

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
        <p className={styles.content}>Popover content rendered with the PC theme.</p>
      </PopoverPanel>
    </Popover>
  ),
};
