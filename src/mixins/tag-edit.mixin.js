import { mapState, mapActions } from 'vuex';

export default ({ setTags }) => ({
  computed: {
    ...mapState({
      tags: state => state.tags.list
    }),
    editTagNames() {
      return this.data.Tags.map(tag => tag.name);
    }
  },
  methods: {
    ...mapActions(['setTagsList', 'setSaveTagsMethod']),
    setTagsEdit() {
      this.setTagsList(this.editTagNames);
      this.setSaveTagsMethod(this.saveTagsMethod);
    },
    saveTagsMethod() {
      const payload = [this.data.id, { tags: this.tags }];
      return setTags(...payload)
        .then(() => {
          this.setTagsList(this.tagField);
        })
        .then(() => this.getData());
    }
  }
});
