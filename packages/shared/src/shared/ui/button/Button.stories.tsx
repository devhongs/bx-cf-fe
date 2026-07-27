import { Button } from './Button';
import styles from './Button.stories.module.css';

export default {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
};

export const Variants = {
  render: () => (
    <div className={styles.variants}>
      <Button>Default</Button>
      <Button variant="submit">Submit</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
};
