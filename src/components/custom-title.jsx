import { createCustomElement, required } from 'better-react-web-component';

CustomTitleComponent.types = {
  content_key: required.string,
};

/**
 * @this {{ kasko: KaskoPublicService }}
 * @param {import("better-react-web-component").InferProps<typeof CustomTitleComponent.types>} params
 */
export function CustomTitleComponent(
  { content_key },
) {
  return (
    <div className='custom-heading-wrapper'>
      <h1>Hello world from REACT!</h1>
      <h2>{this.kasko.getTranslation(content_key)}</h2>
    </div>
  );
}

/**
 * @param {KaskoPublicService} kasko
 */
export default (kasko) => {
  return createCustomElement(CustomTitleComponent, 'shadowRoot', { kasko });
};
