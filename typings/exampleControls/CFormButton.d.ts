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
    caption: string;
}
export declare class CFormButton extends CFormManagedControl<CFormButtonProps> {
    render(): JSX.Element;
    protected onClick: (event: React.MouseEvent<Element>) => void;
}
export {};
