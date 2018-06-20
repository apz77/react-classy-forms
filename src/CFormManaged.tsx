import * as React from 'react';
import { FormManagedControlProps, FormManagedInputProps, IInput } from './formTypes';


export abstract class CFormManagedInput<T, P extends FormManagedInputProps<T>, S>
  extends React.Component<P, S>
  implements IInput {
}


export abstract class CFormManagedControl<P extends FormManagedControlProps, S> extends React.Component<P, S> {
}
