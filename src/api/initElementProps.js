import ElementUI from 'element-ui';

Object.assign(ElementUI.Tooltip.props, {
  enterable: { default: false },
  placement: { default: 'top' }
});
Object.assign(ElementUI.Input.props, {
  clearable: { default: true }
});
Object.assign(ElementUI.Select.props, {
  clearable: { default: true },
  size: { default: 'small' }
});
Object.assign(ElementUI.Button.props, {
  size: { default: 'medium' }
});
Object.assign(ElementUI.Card.props, {
  shadow: { default: 'never' }
});
Object.assign(ElementUI.Dialog.props, {
  closeOnClickModal: { default: false },
  modalAppendToBody: { default: false },
  top: { default: '5vh' }
});
