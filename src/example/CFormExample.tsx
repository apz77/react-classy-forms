import * as React from 'react';
import { CForm } from '../CForm';
import { CSubForm } from '../CSubForm';
import {
  CFormManagedControl,
  CFormManagedInput,
  FormManagedControlProps,
  FormManagedInputProps,
} from '../formTypes';

// Describe editable interfaces

// This is top editable interface
interface IEditedValue {
  id: string;
  name: string;
  complicatedField: IComplicatedSubValue;
}

// This is inner editable interface of one of the top fields
interface IComplicatedSubValue {
  isEnabled: number;
  name: string;
}

// Declare top form component
class CMyForm extends CForm<IEditedValue> {
  // This is optional, i just wanna make it styled and react on submit by keyboard
  render() {
    return <form style={{ display: 'table', maxWidth: '400px' }}>{super.render()}</form>;
  }
}

// Declare inner subform to edit one of complicated top fields
class CMySubForm extends CSubForm<IComplicatedSubValue> {}

// The example components itself
export class CFormExample extends React.Component {
  render() {
    return (
      <CMyForm fields={['id', 'name', 'complicatedField']} isValid={this.isValid} onSubmit={this.onSubmit}>
        <CInput field={'id'} label={'Id'}/>
        <CInput field={'name'} label={'Name'}/>
        <CMySubForm field={'complicatedField'} fields={['isEnabled', 'name']}>
          <CCheckbox field={'isEnabled'} label={'Enable'}/>
          <CInput field={'name'} label={'Complex field name'}/>
        </CMySubForm>
        <CButton />
        <CButton submit={true} />
      </CMyForm>
    );
  }

  private isValid = (value: IEditedValue) => {
    return Boolean(value.id && value.name && value.complicatedField);
  };

  private onSubmit = (value: IEditedValue) => {
    // Process your submit request here
    console.log('Submitted value:', value);
  };
}

// ------------------------ the following code should be part of your components library -----------------------------

// Example of controlled text input
class CInput extends CFormManagedInput<string, FormManagedInputProps<string> & { label: string }> {
  render() {
    const { value, disabled, label } = this.props;
    return <div style={{display: 'table-row'}}>
      <label style={{display: 'table-cell'}}>{label}</label>
      <input style={{display: 'table-cell'}} type={'text'} value={value || ''} onChange={this.onChange} disabled={disabled} />
    </div>
  }

  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    onChange && onChange(e.currentTarget.value);
  };
}

// Example of controlled checkbox
class CCheckbox extends CFormManagedInput<boolean, FormManagedInputProps<boolean> & { label: string }> {
  render() {
    const { value, disabled, label } = this.props;
    return <div style={{display: 'table-row'}}>
      <input style={{display: 'table-cell'}} type={'checkbox'} checked={!!value} onChange={this.onChange} disabled={disabled} />
      <label style={{display: 'table-cell'}}>{label}</label>
    </div>
  }

  private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    onChange && onChange(e.currentTarget.checked);
  };
}

// Example of controlled button
class CButton extends CFormManagedControl<FormManagedControlProps> {
  render() {
    const { disabled, isLoading, submit } = this.props;
    return (
      <button disabled={disabled} onClick={this.onClick}>
        {`${submit ? 'submit' : 'button'} ${isLoading ? '(Loading)' : ''}`}
      </button>
    );
  }

  protected onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { onClick } = this.props;
    e.preventDefault();
    onClick && onClick();
  }
}
