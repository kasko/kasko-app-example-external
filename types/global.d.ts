import type { KaskoPublicService as Service } from './public.service.d';

interface PluginModel {
  name: string;
  components: PluginComponentsModel[];
}

interface PluginComponentsModel {
  type: string;
  component: Object;
}

export interface PluginValidationContextModel {
  args: string[];
  fieldName: string;
  value: any;
}

interface PluginValidationsModel {
  name: string;
  validate: (context: PluginValidationContextModel) => (Record<string, boolean> | null);
}

interface PluginRegistrationConfig {
  components?: PluginComponentsModel[];
  validators?: PluginValidationsModel[];
}

type PluginRegistrationConfigFactory =
  (kasko: Service) => PluginRegistrationConfig | void;

// @ts-ignore
export declare global {
  type KaskoPublicService = Service;
  type KaskoPluginValidationsModel = PluginValidationsModel;
  interface Window {
    registerKaskoPlugin: (
      name: string,
      factory: PluginRegistrationConfigFactory | PluginRegistrationConfig
    ) => void;
  }
}
