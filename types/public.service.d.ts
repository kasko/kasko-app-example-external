// @ts-ignore

/**
 * External Public Service interfaces.
 *
 * Used for type validation in webapps.
 *
 * IMPORTANT: this file should NOT import any interfaces.
 */

export interface ApiManifestJsonLogic {
  type: 'jsonlogic';
  schema: any;
}

interface MediaModel {
  id: string;
  signature: string;
  designation: string;
  mimeType: string;
  fileSize: number;
  name: string;
  url: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

type KaskoExternalDispatcherEvents = {
  /* Set local state (patchValue) */
  (name: 'set-form-input', config: Record<string, any>): void;

  /* Set global state + trigger requests (if valid) (ExtendInput) */
  (name: 'set-state-input', config: Record<string, any>): void;

  /* Reset global state by replacing it all with payload (ResetInput) */
  (name: 'reset-state-input', config: Record<string, any>): void;

  /* Set global + local state via specific path */
  (name: 'write-input', config: { overwrite?: boolean; path: string; value: any }): void;

  /* Open a specific screen (using this should be a last-resort, preferably use `go-forward` event and manifest `next` definition) */
  (name: 'go-to-screen', config: { screen: string }): void;

  /* Go to a screen which contains a specified field; config: `{ field: 'first_name' }` */
  (name: 'go-to-field', config: { field: string }): void;

  /* Validate + trigger requests + next screen (SubmitInput, but without input) */
  (name: 'go-forward', config: void): void;

  /* Proceed to previous screen (Back) */
  (name: 'go-back', config: void): void;

  /* Set a specific flag to a global state; config: { editing: true } */
  (name: 'set-flag', config: Record<string, boolean>): void;

  /* Sets global error messages. Config should match new API validation error response */
  (name: 'set-errors', config: { field: string; path?: string | null; code: string }[]): void;

  /* Removes global error/s messages from specific fields */
  (name: 'remove-errors', config: { field: string; path?: string | null; code?: string }[]): void;

  /* Triggers requests to our API (quote and/or policy) */
  (name: 'trigger-requests', config: void): void;

  /* Validates form and returns validity to callback */
  (name: 'validate-form', callback?: (isValid: boolean) => void): void;

  /* Sets custom data for data lookup component. Need to pass the name of data and a promise response */
  (name: 'set-custom-data', config: { name: string; handler: Promise<any> }): void;

  /* Change webapp content according to chosen language */
  (name: 'change-language', config: { language: string }): void;

  /**
   * Loads new item with specified item_id
   * - pass `shouldOverwrite: false` to preserve current state upon item change, optional
   * - pass `shouldNavigate: false` to skip initial_screen navigation upon item change, optional
   * */
  (
    name: 'request-item',
    config: { item_id: string; shouldOverwrite?: boolean; shouldNavigate?: boolean },
  ): void;

  /* Submits form data to input state if data is valid */
  (
    name: 'submit-form',
    config: { input: Record<string, any>; submitType?: 'set' | 'submit' },
  ): void;

  /* Triggers payment request */
  (name: 'request-payment', config: void): void;

  /**
   * Triggers lead request
   * pass `shouldNavigate: false` to disable auto navigation to next screen after lead is created
   */
  (name: 'save-quote', config: { shouldNavigate?: boolean }): void;

  /* Add a new media file to a global state */
  (
    name: 'add-upload',
    config: {
      file: File;
      field_name: string;
      id: number;
      callback?: (error?: null | Error, payload?: MediaModel) => void;
    },
  ): void;

  /* Remove a media file with a specified id from a global state */
  (name: 'remove-upload', config: { id: number | string }): void;

  /* Save latest input state as a backup value when user goes back */
  (name: 'save-input-snapshot', config: void): void;

  /**
   * Fetches data from Data Service
   *   config: {
   *     field_name: 'test_field',
   *     data_field_name: 'data_field',
   *     filter: [{
   *       filter_param: 'filter_param',
   *     }],
   *     field_map: {
   *       map_param: 'map_param',
   *     },
   *     value: 'value',
   *     callback: () => {},
   *   }
   * */
  (name: 'search-for-data', config: void): void;
  (name: 'edit-field', config: void): void;

  /* Trigger offer update and returns callback value if offer update is successful or not */
  (name: 'offer-update', callback?: (isSuccessful: boolean) => void): void;

  /* Load payment providers */
  (name: 'load-payment-providers', config: void): void;
};

type KaskoExternalListenerEvents = {
  /* Monitors field validity */
  (name: 'field-validation', callback: (value: boolean) => void): void;

  /* Monitors validation errors */
  (name: 'validation-error', callback: (value: Record<string, any>) => void): void;

  /* Monitors when form is valid */
  (name: 'validation-success', callback: () => void): void;

  /* Monitors input state changes */
  (
    name: 'state-changed',
    callback: (value: any) => void,
    config: { slice?: string | string[] },
  ): void;

  /* Monitors route changes */
  (name: 'route-changed', callback: (value: { previous: any; current: any }) => void): void;

  /* Monitors form state changes */
  (name: 'form-changed', callback: (value: { previous: any; current: any }) => void): void;

  /* Monitors loading state changes */
  (name: 'is-loading', callback: (value: boolean) => void): void;

  /* Monitors that leads request is loading */
  (name: 'is-loading-leads', callback: (value: boolean) => void): void;

  /* Monitors that leads request returns error */
  (name: 'is-error-leads', callback: (value: boolean) => void): void;

  /* Monitors `SET_DEFAULT_INPUT` action */
  (name: 'default-input-set', callback: () => void): void;

  /* Monitors successful item request response */
  (name: 'item-loaded', callback: (value: Record<string, any>) => void): void;

  /* Monitors successful get policy request response */
  (name: 'policy-loaded', callback: (value: Record<string, any>) => void): void;

  /* Subscribes to any request to get pre-built payload from it when it changes */
  (
    name: 'request-payload-ready',
    callback: (value: {
      isReady: boolean;
      isValid: boolean;
      errors: Record<string, string[]> | null;
      payload: Record<string, any>;
    }) => void,
  ): void;
};

/**
 * Kasko Service class that is passed on to external WEB components.
 *
 * It can be used to retrieve slices of state, translations, dispatch
 * events etc.
 */
export interface KaskoPublicService {
  /**
   * Holds info about whether or not user is opened webapp in debug mode.
   */
  isDebugMode: boolean;

  /**
   * Retrieve a translation by the given translation key.
   */
  getTranslation(key: string, params?: Record<string, any>): string;

  /**
   * Get the whole form state.
   */
  getFormState<T = Record<string, any>>(): T;
  /**
   * Get slice from form state.
   */
  getFormState<T = any>(slice: string): T;

  /**
   * Get the whole state or a slice of the state.
   */
  getState(slice?: string): any;

  /**
   * Get all validations for specific field_name.
   */
  getFieldValidationByName(field_name: string): FieldDefinitionValidationModel[] | undefined;

  /**
   * Creates date from string via kaskoDate.
   */
  createDate(date?: Date | string | number): Date;

  /**
   * Run a JsonLogic schema.
   *
   * @see: http://jsonlogic.com/
   */
  evaluateJsonLogic(schema: ApiManifestJsonLogic, args?: Record<string, any>): any;

  /**
   * Get pre-built request payload by name.
   */
  getRequestPayload(name: string): {
    isReady: boolean;
    isValid: boolean;
    errors: Record<string, string[]> | null;
    payload: Record<string, any>;
  };

  /**
   * Dispatch an event.
   */
  dispatchEvent: KaskoExternalDispatcherEvents;

  /**
   * Listen to an event.
   */
  addEventListener: KaskoExternalListenerEvents;

  /**
   * Remove all event listeners with the same name & callback.
   */
  removeEventListener(name: string, handler: Function): void;

  /**
   * Retrieve a referrer URL by the given query string state.
   */
  getReferrerUrl(): string;

  /**
   * Checks if form has any errors for specific field.
   */
  shouldShowError(field_name: string): boolean;
}
