const ContentEditable = {
  install (Vue, options) {
    Vue.component('editable', {
      template: '<div contenteditable="true" @input="update"></div>',
      props: ['content'],
      mounted () {
        this.$el.innerText = this.content
      },
      methods: {
        update (event) {
          this.$emit('update', event.target.innerText)
        }
      }
    })
  }
}

export default ContentEditable
