export default {
  visibility: {
    id: 'visibility',
    title: 'Visibility',
    type: 'switch',
    data: [
      {
        name: 'hideFromMinors',
        text: 'Hide from minors'
      },
      {
        name: 'hideFromSearch',
        text: 'Hide from search results'
      }
    ]
  },
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
        text: 'Followers (only followers can see posts)',
        value: 2
      },
      {
        text: 'Alias whitelist (only those added to the list)',
        value: 3
      },
      {
        text: 'Alias blacklist (anyone not added to the list)',
        value: 4
      }
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
        text: 'Followers (only followers can comment)',
        value: 2
      },
      {
        text: 'Alias whitelist (only those added to the list)',
        value: 3
      },
      {
        text: 'Alias blacklist (anyone not added to the list)',
        value: 4
      }
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
        text: 'Followers (only followers can react)',
        value: 2
      },
      {
        text: 'Alias whitelist (only those added to the list)',
        value: 3
      },
      {
        text: 'Alias blacklist (anyone not added to the list)',
        value: 4
      }
    ]
  }
};
