import * as React from 'react';
import { CFormManagedInput, FormManagedInputProps } from '../formTypes';


interface CFormInputProps extends FormManagedInputProps<string> {
/*
  Those props are derivated from FormManagedInputProps<string>

  field?: FormFieldMetadata;
  value?: Partial<T>;
  disabled?: boolean;
  onChange?: (value: T) => void;
  onSubmitEditing?: () => void;   // On most inputs that would be pressing Enter key of finishing selection, etc.
*/
  className?: string;
  style?: React.CSSProperties;
}

/**
 * This is example of form controllable input, able to edit a string
 */
export class CFormInput extends CFormManagedInput<string, CFormInputProps> {

  protected ref: HTMLInputElement | null = null;

  public focus() {
    this.ref && this.ref.focus();
  }

  render() {
    const { value, className, style } = this.props;
    return <input value={value}
                  onChange={this.onChange}
                  onKeyPress={this.onKeyPress}
                  ref={this.onRef}
                  className={className} style={style}/>
  }

  protected onRef = (ref: HTMLInputElement) => this.ref = ref;

  protected onChange = (event: React.ChangeEvent) => {
    const { onChange } = this.props;
    onChange && this.ref && onChange(this.ref.value);
  }

  protected onKeyPress = (event: React.KeyboardEvent) => {
    // Submit edit on Enter key
    if (event.which === 13 || event.keyCode === 13) {
      const { onSubmitEditing } = this.props;
      if (onSubmitEditing) {
        event.preventDefault();
        onSubmitEditing();
      }
    }
  }

}
