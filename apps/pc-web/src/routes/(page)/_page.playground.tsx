import { createFileRoute } from '@tanstack/react-router';

import { PlaygroundPage } from '@/pages/playground';

export const Route = createFileRoute('/(page)/_page/playground')({
  component: PlaygroundPage,
});
