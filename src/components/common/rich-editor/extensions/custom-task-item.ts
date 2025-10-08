import TaskItem from '@tiptap/extension-task-item';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export const CustomTaskItem = TaskItem.extend({
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('taskItemClickHandler'),
        props: {
          handleClickOn: (view, pos, node, nodePos, event) => {
            const target = event.target as HTMLElement;
            
            // Chỉ xử lý khi click vào checkbox
            if (target.tagName === 'INPUT' && target.getAttribute('type') === 'checkbox') {
              const { tr } = view.state;
              const currentNode = view.state.doc.nodeAt(nodePos);
              
              if (currentNode && currentNode.type.name === 'taskItem') {
                const newAttrs = {
                  ...currentNode.attrs,
                  checked: !currentNode.attrs.checked,
                };
                
                tr.setNodeMarkup(nodePos, undefined, newAttrs);
                view.dispatch(tr);
                
                // Ngăn event propagation
                event.preventDefault();
                event.stopPropagation();
                return true;
              }
            }
            
            return false;
          },
        },
      }),
    ];
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
        'data-checked': node.attrs.checked ? 'true' : 'false',
      },
      [
        'label',
        {
          contenteditable: 'false',
        },
        [
          'input',
          {
            type: 'checkbox',
            checked: node.attrs.checked ? 'checked' : null,
          },
        ],
      ],
      ['div', { class: 'task-content' }, 0],
    ];
  },

  addAttributes() {
    return {
      checked: {
        default: false,
        keepOnSplit: false,
        parseHTML: element => element.getAttribute('data-checked') === 'true',
        renderHTML: attributes => {
          return {
            'data-checked': attributes.checked ? 'true' : 'false',
          };
        },
      },
    };
  },
});
