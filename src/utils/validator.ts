import { useCallback, useState } from 'react';

export const useForm = () => {
  const [values, setValues] = useState({});

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const name = target.name;
    setValues({ ...values, [name]: value });
  };

  return { values, handleChange, setValues };
};

export function useFormWithValidation<TValues>() {
  const [values, setValues] = useState({} as TValues);
  const [errors, setErrors] = useState({} as TValues);
  const [isValid, setIsValid] = useState(false);

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const form = target.closest('form') as HTMLFormElement;
    const name = target.name;
    const value = target.value;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: target.validationMessage });
    setIsValid(form.checkValidity());
  };

  const resetForm = useCallback(
    (
      newValues = {} as TValues,
      newErrors = {} as TValues,
      newIsValid = false,
    ) => {
      setValues(newValues);
      setErrors(newErrors);
      setIsValid(newIsValid);
    },
    [setValues, setErrors, setIsValid],
  );

  return { values, handleChange, errors, isValid, resetForm };
}
