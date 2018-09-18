# Manageable React Forms

## Rationale
1. Reduce boilerplate code.
2. Make it easy to work with auto-generated API intefaces.
3. Take care of reaction on validation, submission, disabling a form.
4. Provide basic type checking via typescript.
5. Should work with in React and ReactNative.

## Basic Usage of CForm
Both CForm and CSubForm are not UI components, they render React.Fragment
You may implement your own render in inherited forms or wrap it in required components.

Please, refer to [CFormExample.tsx](./src/example/CFormExample.tsx)

Basically you need to extend your form component from CForm instantiated with an interface describing structure of your editable data.
Then you may pass value with initial data, which could be partial of editable data interface.
If you pass fields prop, CForm will guarantee that those fields will be always in its value
when passed to isValid or onSubmit callbacks.

isValid callback is used to validate form data. If isValid returns false,
CForm will disable all controlled buttons with submit={true}.

onSubmit callback is called when user clicks on any controlled buttons with submit={true}.
if onSubmit returns Promise, CForm will turn into loading state until the promise resolves or rejects.
loading state disables all controlled inputs, and pushed isLoading prop to all controlled buttons.


## Manageable Inputs & Controls

CForm (CSubForm) analyzes all its children deep down its tree and looks for manageable inputs and controls.
Those should be inherited from CFormManagedInput and CFormManagedControl, and their props should be inherited from
FormManagedInputProps and FormManagedControlProps appropriately.


## Further options
For the rest of properties, please refer to source code and its comments.


