"use client"

import {
  ClipboardEvent,
  forwardRef,
  InputHTMLAttributes,
  KeyboardEvent,
  useState
} from "react"
import { mergeClasses } from "@vardast/tailwind-config/mergeClasses"
import { LucideX } from "lucide-react"
import uniq from "ramda/src/uniq"

const KEYS = {
  ENTER: "Enter",
  TAB: "Tab",
  BACKSPACE: "Backspace",
  UP_ARROW: "ArrowUp",
  DOWN_ARROW: "ArrowDown",
  ESCAPE: "Escape",
  SPACE: "Space",
  COMMA: "Comma"
}

// const DELIMITERS = ["ENTER", "COMMA"]

interface TagItemProps {
  title: string
}

const TagItem = ({ title }: TagItemProps) => {
  return (
    <div className="tag-item">
      <span className="tag-item-title">{title}</span>
      <button type="button" className="tag-item-delete-button">
        <LucideX className="icon" />
      </button>
    </div>
  )
}

export interface TagInputProps extends InputHTMLAttributes<HTMLInputElement> {
  tags: string[]
  onDelete: (_: number) => void
  onAddition: (_: string) => void
}

const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
  ({ onDelete, onAddition, tags, placeholder, className }) => {
    const [query, setQuery] = useState<string>("")
    let textInput: HTMLInputElement | null = null

    const resetAndFocusInput = () => {
      setQuery("")
      if (textInput) {
        textInput.value = ""
        textInput.focus()
      }
    }

    const addTag = (tag: string) => {
      if (!tag) {
        return
      }
      const existingKeys = tags && tags.map((tag) => tag.toLowerCase())

      // Return if tag has been already added
      if (existingKeys && existingKeys.indexOf(tag.toLowerCase()) >= 0) {
        return
      }

      onAddition(tag)

      // call method to add
      //   if (currentEditIndex !== -1 && props.onTagUpdate)
      //     props.onTagUpdate(currentEditIndex, tag)
      //   else props.handleAddition(tag)

      // reset the state
      setQuery("")
      resetAndFocusInput()
    }

    const handleDelete = (
      index: number,
      event: KeyboardEvent<HTMLInputElement>
    ) => {
      event.preventDefault()
      event.stopPropagation()
      const currentTags = tags.slice()
      if (currentTags.length === 0) {
        return
      }
      onDelete(index)
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === KEYS.ENTER) {
        event.preventDefault()
        event.stopPropagation()
        query && query !== "" && addTag(query)
      }

      if (event.key === KEYS.BACKSPACE && query === "") {
        handleDelete(tags.length - 1, event)
      }
    }

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault()

      const clipboardData = event.clipboardData || window.Clipboard
      const pastedText = (clipboardData as DataTransfer).getData("text")
      const tags: string[] = pastedText.split("-")

      // Only add unique tags
      // const uniqueTags = uniq(tags)
      uniq(tags)
        .map((tag) => tag.trim())
        .forEach((tag) => {
          addTag(tag)
        })
    }

    return (
      <div className={mergeClasses("input-field tag-field", className)}>
        {tags && tags.length > 0 && (
          <div className="tag-field-tags">
            {tags.map((tag, idx) => (
              <TagItem title={tag} key={idx} />
            ))}
          </div>
        )}
        {tags && tags.length <= 0 && query === "" && (
          <span className="tag-input-placeholder">{placeholder}</span>
        )}
        <input
          type="text"
          className="tag-field-input"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => handleKeyDown(event)}
          onPaste={(event) => handlePaste(event)}
          ref={(input) => {
            textInput = input
          }}
        />
      </div>
    )
  }
)
TagInput.displayName = "TagInput"

export { TagInput }
