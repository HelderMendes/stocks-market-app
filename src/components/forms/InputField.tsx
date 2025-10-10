import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import React from 'react';
import { Input } from '@/components/ui/input';

const InputField = ({
  name,
  label,
  placeholder,
  register,
  error,
  validation,
  type = 'text',
  disabled,
  value,
}: FormInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>
      <Input
        type={type}
        id={name}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        className={cn('form-input w-full', {
          'cursor-not-allowed opacity-50': disabled,
        })}
        {...register(name, validation)}
      />
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

export default InputField;
