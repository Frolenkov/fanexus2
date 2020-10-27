import { post } from '~api';

export const createFormData = event => {
  const data = new FormData();
  data.append('name', 'image');
  data.append('image', event.target.files[0]);

  return data;
};

const imageRoot = 'image';
// payload should be type of FormData
export const imageUpload = payload => post(`${imageRoot}/upload`, payload);
