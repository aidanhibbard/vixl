<script setup lang="ts">
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from '@tiptap/markdown'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { useDebounceFn } from '@vueuse/core'
import { onBeforeUnmount, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { readNoteContent, writeNoteContent } from '@/lib/notes/note-io'
import { formatWorkspaceError } from '@/lib/workspace/format-workspace-error'

const props = defineProps<{
  filePath: string
}>()

const isLoading = ref(true)

const saveContent = useDebounceFn(async (markdown: string): Promise<void> => {
  try {
    await writeNoteContent(props.filePath, markdown)
  } catch (error) {
    toast.error(formatWorkspaceError(error))
  }
}, 500)

const editor = useEditor({
  extensions: [
    StarterKit,
    Markdown,
    Placeholder.configure({
      placeholder: 'Start writing...',
    }),
  ],
  content: '',
  contentType: 'markdown',
  editorProps: {
    attributes: {
      class:
        'tiptap prose prose-sm dark:prose-invert max-w-none min-h-[60vh] px-1 focus:outline-none',
    },
  },
  onUpdate: ({ editor: currentEditor }) => {
    if (isLoading.value) {
      return
    }
    void saveContent(currentEditor.getMarkdown())
  },
})

const loadContent = async (filePath: string): Promise<void> => {
  isLoading.value = true
  try {
    const markdown = await readNoteContent(filePath)
    editor.value?.commands.setContent(markdown, { contentType: 'markdown' })
  } catch (error) {
    toast.error(formatWorkspaceError(error))
  } finally {
    isLoading.value = false
  }
}

watch(
  () => props.filePath,
  (filePath) => {
    if (filePath) {
      void loadContent(filePath)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <EditorContent :editor="editor" />
</template>
