import { createFormData, imageUpload } from '@/services/image.service';

export const actions = {
  formatBlock: 'formatBlock',
  formatBlockH1: 'formatBlockH1',
  formatBlockH2: 'formatBlockH2',
  uploadImage: 'uploadImage',
  formatBlockquote: 'formatBlockquote'
};

export const commands = [
  { id: 1, type: 'bold', icon: 'bold' },
  { id: 2, type: 'italic', icon: 'italic' },
  { id: 3, type: 'underline', icon: 'underline' },
  { id: 4, type: 'strikeThrough', icon: 'strikeThrough' },
  { id: 5, type: 'subscript', icon: 'subscript' },
  { id: 6, type: 'superscript', icon: 'superscript' },
  { id: 7, type: 'formatBlockH1', icon: 'formatBlockH1' },
  { id: 8, type: 'formatBlockH2', icon: 'formatBlockH2' },
  { id: 9, type: 'insertUnorderedList', icon: 'insertUnorderedList' },
  { id: 10, type: 'insertOrderedList', icon: 'insertOrderedList' },
  { id: 11, type: 'formatBlockquote', icon: 'quote' }
];
export const mediaActions = [
  { id: 1, type: 'createLink', icon: 'link-icon' },
  { id: 2, type: 'uploadImage', icon: 'image-icon' }
];

const createLink = () => {
  // eslint-disable-next-line no-alert
  return prompt('Enter the URL') || undefined;
};
/** @TODO revise usage of editorContent */
const uploadImage = (editorContent, event, callback) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.addEventListener(
    'load',
    async function() {
      const formData = createFormData(event);
      const img = document.createElement('img');

      const { accessUrl } = await imageUpload(formData);
      img.src = accessUrl;

      callback(img);
    },
    false
  );

  if (file) {
    reader.readAsDataURL(file);
  }
};

export const getQueryCommandState = aCommandName =>
  document.queryCommandState(aCommandName);

export const execCommand = (
  aCommandName,
  aShowDefaultUI = false,
  aValueArgument = '',
  editorContent,
  event,
  formatBlock,
  callback
) => {
  switch (aCommandName) {
    case 'createLink':
      aValueArgument = createLink();
      break;
    case actions.uploadImage:
      uploadImage(editorContent, event, callback);
      break;
  }

  if (
    aCommandName === 'formatBlockH1' ||
    aCommandName === 'formatBlockH2' ||
    aCommandName === 'formatBlockquote'
  ) {
    document.execCommand('formatBlock', aShowDefaultUI, formatBlock);
  } else {
    document.execCommand(aCommandName, aShowDefaultUI, aValueArgument);
  }
};
