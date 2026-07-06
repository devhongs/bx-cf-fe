import { createFileRoute } from '@tanstack/react-router';

import { FormPage } from '@/pages/form';

export const Route = createFileRoute('/(page)/_page/form')({
  component: FormPage,
});
