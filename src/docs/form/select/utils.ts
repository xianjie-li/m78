import { SelectOptionItem } from '@/components/select';

export const options = [
  {
    label: 'vanillaJS',
    value: 1,
  },
  {
    label: 'typescript',
    value: 2,
  },
  {
    label: 'react',
    value: 3,
  },
  {
    label: 'vue',
    value: 4,
  },
  {
    label: 'angular',
    value: 5,
  },
  {
    label: 'dart',
    value: 6,
  },
  {
    label: 'node',
    value: 7,
  },
  {
    label: 'wasm',
    value: 8,
  },
  {
    label: 'kotlin',
    value: 9,
  },
];

export function fakeOptions(num: number): SelectOptionItem[] {
  return Array.from({ length: num }).map((_, index) => ({
    label: `选项${index}`,
    value: index,
  }));
}
