import { useState, useEffect, useRef } from "react"
import { Upload, Trash, File } from "lucide-react"

interface FileUploadProps {
    onFileSelect?: (file: File | null) => void
    accept?: string
    maxSize?: number
    value?: File | null
    disabled?: boolean
}

export default function FileUpload({
                                       onFileSelect,
                                       accept = ".pdf,.doc,.docx,.txt",
                                       maxSize = 10,
                                       value,
                                       disabled,
                                   }: FileUploadProps) {
    const [file, setFile] = useState<File | null>(value || null)
    const [error, setError] = useState("")
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (value !== undefined) setFile(value)
    }, [value])

    const validateFile = (selectedFile: File): string | null => {
        const ext = "." + selectedFile.name.split(".").pop()?.toLowerCase()
        const accepted = accept.split(",").map(t => t.trim())
        if (!accepted.includes(ext)) return `Please upload a ${accept} file`
        if (selectedFile.size / 1024 / 1024 > maxSize)
            return `File size must be less than ${maxSize}MB`
        return null
    }

    const handleFile = (selectedFile: File) => {
        const error = validateFile(selectedFile)
        if (error) {
            setError(error)
            setFile(null)
            onFileSelect?.(null)
            return
        }

        setError("")
        setFile(selectedFile)
        onFileSelect?.(selectedFile)
    }

    return (
        <div className="w-full">
            {!file && (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => {
                        e.preventDefault()
                        setIsDragging(true)
                    }}
                    onDragLeave={e => {
                        e.preventDefault()
                        setIsDragging(false)
                    }}
                    onDrop={e => {
                        e.preventDefault()
                        setIsDragging(false)
                        const dropped = e.dataTransfer.files?.[0]
                        if (dropped) handleFile(dropped)
                    }}
                    className={`
            cursor-pointer shadow-[4px_4px_0_#000000]
            flex items-center justify-center gap-2
            border-2 border-card-foreground rounded-lg
            px-4 py-2 transition-colors
            ${isDragging ? "bg-muted" : "bg-transparent"}
          `}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        disabled={disabled}
                        className="hidden"
                        onChange={e => {
                            const file = e.target.files?.[0]
                            if (file) handleFile(file)
                        }}
                    />

                    <Upload className="w-4 h-4 text-foreground" />
                    <span className="text-md font-medium text-foreground">
            Upload file
          </span>
                </div>
            )}

            {file && (
                <div className="flex items-center justify-between px-4 py-2 border-2 border-card-foreground rounded-lg shadow-[4px_4px_0_#000000]">
                    <div className="flex items-center gap-3 text-left">
                        <File className="w-8 h-8 text-foreground" />
                        <div>
                            <p className="text-md font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setFile(null)
                            onFileSelect?.(null)
                        }}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors"
                    >
                        <Trash className="w-5 h-5 hover:text-red-400" />
                    </button>
                </div>
            )}

            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
    )
}
