// extensions/custom-task-item.ts
import TaskItem from '@tiptap/extension-task-item'

export const CustomTaskItem = TaskItem.extend({
  addNodeView() {
    return ({ node, HTMLAttributes, getPos, editor }) => {
      const listItem = document.createElement('li')
      const checkboxWrapper = document.createElement('label')
      const checkbox = document.createElement('input')
      const content = document.createElement('div')

      checkboxWrapper.contentEditable = 'false'
      checkbox.type = 'checkbox'
      checkbox.checked = node.attrs.checked

      let isProcessing = false
      
      checkbox.addEventListener('change', (event) => {
        if (isProcessing) return
        
        const pos = getPos()
        if (pos === undefined) return

        isProcessing = true
        const checked = (event.target as HTMLInputElement).checked

        // Ngăn editor khỏi việc capture input events
        editor.setEditable(false)
        
        editor
          .chain()
          .command(({ tr }) => {
            tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              checked,
            })
            return true
          })
          .run()

        // Re-enable editor sau một tick
        setTimeout(() => {
          editor.setEditable(true)
          isProcessing = false
        }, 0)
      })

      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        listItem.setAttribute(key, value as string)
      })

      checkboxWrapper.appendChild(checkbox)
      listItem.appendChild(checkboxWrapper)
      listItem.appendChild(content)

      return {
        dom: listItem,
        contentDOM: content,
        update: (updatedNode) => {
          if (updatedNode.type !== this.type) {
            return false
          }

          if (checkbox.checked !== updatedNode.attrs.checked) {
            checkbox.checked = updatedNode.attrs.checked
          }
          
          return true
        },
        ignoreMutation: (mutation) => {
          // Ignore tất cả mutations từ checkbox
          return mutation.target === checkbox || 
                 mutation.target === checkboxWrapper ||
                 checkboxWrapper.contains(mutation.target as Node)
        }
      }
    }
  },
})