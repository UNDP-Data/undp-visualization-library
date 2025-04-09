// nullUndefinedChecker.stories.tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react'; // adjust import path as needed
import { checkIfNullOrUndefined } from '@/index';

// eslint-disable-next-line react/function-component-definition
const NullUndefinedCheckerComponent: React.FC = () => null;

interface NullCheckerStoryProps {
  value: any;
  displayValue: string;
}

const meta: Meta<typeof NullUndefinedCheckerComponent> = {
  title: 'Utilities/Null Undefined Checker',
  component: NullUndefinedCheckerComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A utility function that checks if a value is `null` or `undefined`.',
      },
      source: {
        code: `
/**
 * Checks whether a given value is \`null\` or \`undefined\`.
 *
 * @param value - The value to check.
 * @returns \`true\` if the value is \`null\` or \`undefined\`, otherwise \`false\`.
 *
 * @example
 * checkIfNullOrUndefined(null); // true
 * checkIfNullOrUndefined(undefined); // true
 * checkIfNullOrUndefined(0); // false
 * checkIfNullOrUndefined(''); // false
 */`,
        language: 'typescript',
        type: 'auto',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NullUndefinedCheckerComponent>;

// Create a template for demonstrating the function
function Template(args: NullCheckerStoryProps) {
  const { value, displayValue } = args;
  const result = checkIfNullOrUndefined(value);

  return (
    <div
      style={{
        fontFamily: 'monospace',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <code>checkIfNullOrUndefined({displayValue})</code>
      </div>
      <div>
        Result:{' '}
        <strong style={{ color: result ? '#2e7d32' : '#c62828' }}>
          {result.toString()}
        </strong>
      </div>
    </div>
  );
}

export const NullValue: Story = {
  render: args => Template(args as NullCheckerStoryProps),
  args: {
    value: null,
    displayValue: 'null',
  },
};

export const UndefinedValue: Story = {
  render: args => Template(args as NullCheckerStoryProps),
  args: {
    value: undefined,
    displayValue: 'undefined',
  },
};
