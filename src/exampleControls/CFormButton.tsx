import * as React from 'react';
import { CFormManagedControl, FormManagedControlProps } from '../formTypes';

interface CFormButtonProps extends FormManagedControlProps {
  /**
   Derivated from FormManagedControlProps

   submit?: boolean;
   disabled?: boolean;
   isLoading?: boolean;
   onClick?: () => void;
   */
  style?: React.CSSProperties;
  className?: string;
  caption: string
}

export class CFormButton extends CFormManagedControl<CFormButtonProps> {
  render() {
    const {caption, className, style, disabled, isLoading} = this.props;
    return <button className={className} style={style} onClick={this.onClick} disabled={disabled || isLoading}>
      {caption}
    </button>;
  }

  protected onClick = (event: React.MouseEvent) => {
    const {onClick} = this.props;
    onClick && onClick();
  }
}
