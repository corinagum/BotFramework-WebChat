export default function useCursorLocation() {
  const activeArea = document.activeElement;

  const textbox = document.querySelector(`.webchat__send-box-text-box__input`);

  return [textbox === activeArea ? activeArea.selectionStart : false];
}
