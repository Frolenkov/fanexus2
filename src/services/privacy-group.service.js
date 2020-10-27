import { get, post, put, remove } from '~api';

const root = 'accessControl';

export const getPrivacyGroup = id => get(`${root}/${id}`);
export const getPrivacyGroups = () => get(`${root}/my`);
export const createPrivacyGroup = payload => put(`${root}`, payload);
export const updatePrivacyGroup = (id, payload) =>
  post(`${root}/${id}`, payload);
export const removePrivacyGroup = id => remove(`${root}/${id}`);
export const addAliasesToPrivacyGroup = (id, payload) =>
  post(`${root}/${id}/addAliases`, payload);
export const removeAliasesFromPrivacyGroup = (id, payload) =>
  post(`${root}/${id}/removeAliases`, payload);
export const addPrivacyGroupToPrivacyGroup = (id, payload) =>
  post(`${root}/${id}/addAccessControlGroup`, payload);
export const removePrivacyGroupFromPrivacyGroup = (id, payload) =>
  post(`${root}/${id}/removeAccessControlGroup`, payload);

export const privacyOptions = [
  {
    name: 'name',
    type: 'input',
    title: 'Privacy group name'
  },
  {
    name: 'isDefault',
    type: 'toggler',
    title: 'Is default'
  },
  {
    name: 'accessControlSetting',
    type: 'radio-button',
    title: 'Access control setting',
    selections: [
      {
        description: 'Full permissions (allow everyone)',
        value: 1
      },
      {
        description: 'Subscribers (allow subscribers)',
        value: 2
      },
      {
        description: 'Allowlist',
        value: 3
      },
      {
        description: 'Blocklist',
        value: 4
      }
    ]
  }
];
