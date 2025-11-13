import React, { useState } from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea
} from '@chakra-ui/react';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormInputMask from './FormInputMask';
import MoneyInput from './MoneyInput';

const FormField = ({ component: Component, field, form, type, ...props }) => {
  const [touched, setTouched] = useState(false);

  const hasError =
    (form.errors[field.name] && form.touched[field.name]) ||
    (form.initialErrors[field.name] && !touched);

  return (
    <FormControl
      isReadOnly={props.readOnly}
      isRequired={props.required}
      isInvalid={hasError}
      mb={3}
    >
      <FormLabel htmlFor={field.name} {...(props.labelProps || {})}>
        {props.placeholder}
      </FormLabel>
      <Component
        field={field}
        form={form}
        type={type}
        onChange={(e) => {
          setTouched(true);
          field.onChange(e);
        }}
        {...props}
      />
      <FormErrorMessage>
        {form.errors[field.name] ||
          (form.initialErrors[field.name] &&
            form.initialErrors[field.name].join('\r\n'))}
      </FormErrorMessage>
    </FormControl>
  );
};

FormField.defaultProps = {
  component: FormInput
};

FormField.Select = (props) => <FormField component={FormSelect} {...props} />;

FormField.Textarea = (props) => (
  <FormField component={Textarea} defaultValue={props.field.value} {...props} />
);

FormField.InputMask = (props) => (
  <FormField component={FormInputMask} {...props} />
);

FormField.InputMoney = (props) => (
  <FormField
    component={MoneyInput}
    customInput={Input}
    defaultValue={props.field.value}
    {...props}
  />
);

export default FormField;
