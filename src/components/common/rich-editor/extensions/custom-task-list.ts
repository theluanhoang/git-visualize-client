
// CustomTaskList.ts
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';

// Custom TaskList Extension
export const CustomTaskList = TaskList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
    };
  },
});

// Custom TaskItem Extension
export const CustomTaskItem = TaskItem.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      checked: {
        default: false,
        keepOnSplit: false,
        parseHTML: element => ({
          checked: element.getAttribute('data-checked') === 'true',
        }),
        renderHTML: attributes => ({
          'data-checked': attributes.checked,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `li[data-type="${this.name}"]`,
        priority: 51,
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'li',
      {
        ...HTMLAttributes,
        'data-type': this.name,
        'data-checked': node.attrs.checked,
        class: node.attrs.checked ? 'task-item-checked' : '',
      },
      [
        'label',
        [
          'input',
          {
            type: 'checkbox',
            checked: node.attrs.checked ? 'checked' : undefined,
          },
        ],
        ['span', 0],
      ],
    ];
  },

  addKeyboardShortcuts() {
    const shortcuts = {
      Enter: () => this.editor.commands.splitListItem(this.name),
      'Shift-Tab': () => this.editor.commands.liftListItem(this.name),
    };

    return shortcuts;
  },
});