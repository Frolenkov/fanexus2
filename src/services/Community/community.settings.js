/** @TODO add whiteList and blackList settings later */

export default {
  content: {
    id: 'contentAccessControl',
    title: 'Content',
    value: null,
    data: [
      {
        text: 'Full (anyone can see the posts)',
        value: 1
      },
      {
        text: 'Members (only members can see posts)',
        value: 2
      }
      // {
      //   text: 'Alias whitelist (only those added to the list)',
      //   value: 3
      // },
      // {
      //   text: 'Alias blacklist (anyone not added to the list)',
      //   value: 4
      // }
    ],
    selectOptions: [
      {
        text: 'Unsubscribe',
        action: 'delete',
        special: true,
        togglable: false
      },
      {
        text: 'Block user',
        action: 'block',
        special: true,
        togglable: false
      },
      {
        text: 'Manage tags',
        action: 'editTags',
        special: false,
        togglable: false
      },
      {
        text: 'Add to security group',
        action: 'visible',
        special: false,
        togglable: true
      }
    ]
  },
  publishing: {
    id: 'postingAccessControl',
    title: 'Post publishing',
    value: null,
    data: [
      {
        text: 'Full (anyone can submit posts)',
        value: 1
      },
      {
        text: 'Members (only members can submit posts)',
        value: 2
      }
      // {
      //   text: 'Alias whitelist (only those added to the list)',
      //   value: 3
      // },
      // {
      //   text: 'Alias blacklist (anyone not added to the list)',
      //   value: 4
      // }
    ]
  },
  comments: {
    id: 'commentsAccessControl',
    title: 'Comments',
    value: null,
    data: [
      {
        text: 'Full (anyone can comment)',
        value: 1
      },
      {
        text: 'Members (only members can comment)',
        value: 2
      }
      // {
      //   text: 'Alias whitelist (only those added to the list)',
      //   value: 3
      // },
      // {
      //   text: 'Alias blacklist (anyone not added to the list)',
      //   value: 4
      // }
    ]
  },
  reactions: {
    id: 'reactionsAccessControl',
    title: 'Reactions',
    value: null,
    data: [
      {
        text: 'Full (anyone can react)',
        value: 1
      },
      {
        text: 'Members (only members can react)',
        value: 2
      }
      // {
      //   text: 'Alias whitelist (only those added to the list)',
      //   value: 3
      // },
      // {
      //   text: 'Alias blacklist (anyone not added to the list)',
      //   value: 4
      // }
    ]
  },
  members: {
    id: 'membersAccessControl',
    title: 'Members',
    /** @TODO revise usage of this */
    value: null,
    data: [
      {
        text: 'Full (anyone can see members)',
        value: 1
      },
      {
        text: 'Members (only members can see members)',
        value: 2
      }
      // {
      //   text: 'Alias whitelist (only those added to the list)',
      //   value: 3
      // },
      // {
      //   text: 'Alias blacklist (anyone not added to the list)',
      //   value: 4
      // }
    ]
  },
  membership: {
    /** @TODO check in API */
    id: 'followsAccessControl',
    title: 'Membership',
    value: null,
    data: [
      {
        text: 'Open (Anyone can join)',
        value: 1
      },
      {
        text: 'Closed (Moderators need to approve new members)',
        value: 2
      }
      // {
      //   text: 'Invite (Members can invite new members)',
      //   value: 3
      // },
      // {
      //   text: 'Closed Invite (Invite, but requires moderator approval)',
      //   value: 4
      // }
    ]
  }
};
