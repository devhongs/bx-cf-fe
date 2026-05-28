import { createFileRoute } from '@tanstack/react-router';

export function SettingPage() {
  return <div>Hello "(page)/_page/setting/"!</div>;
}

export const Route = createFileRoute('/(page)/_page/setting')({
  component: SettingPage,
});
