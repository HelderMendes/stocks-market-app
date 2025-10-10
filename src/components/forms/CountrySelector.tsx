import React, { useMemo } from 'react';
import countryList from 'react-select-country-list';
import { Label } from '@/components/ui/label';
import { Controller } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CountrySelector = ({
  name,
  label,
  placeholder,
  control,
  error,
  required = false,
}: CountrySelectFieldProps) => {
  const countries = useMemo(() => countryList().getData(), []);

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLowerCase()} ` : false,
        }}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger className="select-trigger">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="border-gray-600 bg-gray-800 text-white">
              {countries.map((country) => {
                // convert country ISO code (e.g. "US") into regional indicator symbol letters (emoji flag)
                const emoji =
                  country.value && /^[A-Za-z]{2}$/.test(country.value)
                    ? country.value
                        .toUpperCase()
                        .split('')
                        .map((c) =>
                          String.fromCodePoint(127397 + c.charCodeAt(0))
                        )
                        .join('')
                    : '';

                return (
                  <SelectItem
                    key={country.value}
                    value={country.value}
                    className="flex items-center justify-between focus:bg-gray-600 focus:text-white"
                  >
                    <span aria-hidden className="mr-1 text-2xl">
                      {emoji}
                    </span>
                    <span>{country.label}</span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default CountrySelector;
