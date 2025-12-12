import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash } from "lucide-react";

interface FileUploadProps {
    onFileSelect?: (file: File | null) => void;
    accept?: string;
    maxSize?: number;
    value?: File | null;
    disabled?: boolean;
    onTextChange?: (text: string) => void;
}

export default function FileUpload({
                                       onFileSelect,
                                       onTextChange,
                                       accept = ".pdf,.doc,.docx,.txt",
                                       maxSize = 10,
                                       value,
                                       disabled
                                   }: FileUploadProps) {
    const [file, setFile] = useState<File | null>(value || null);
    const [error, setError] = useState<string>("");
    const [isDragging, setIsDragging] = useState(false);
    const [text, setText] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (value !== undefined) setFile(value);
    }, [value]);

    const validateFile = (selectedFile: File): string | null => {
        const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
        const acceptedTypes = accept.split(',').map(t => t.trim());
        if (!acceptedTypes.includes(fileExtension)) return `Please upload a ${accept} file`;
        if (selectedFile.size / 1024 / 1024 > maxSize) return `File size must be less than ${maxSize}MB`;
        return null;
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            const validationError = validateFile(selectedFile);
            if (validationError) {
                setError(validationError);
                setFile(null);
                onFileSelect?.(null);
                return;
            }
            setError("");
            setFile(selectedFile);
            onFileSelect?.(selectedFile);
        }
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            const validationError = validateFile(droppedFile);
            if (validationError) { setError(validationError); setFile(null); onFileSelect?.(null); return; }
            setError("");
            setFile(droppedFile);
            onFileSelect?.(droppedFile);
        }
    };

    const handleRemove = () => {
        setFile(null);
        setError("");
        onFileSelect?.(null);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="w-full">
            {!file && (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className="shadow-[4px_4px_0_#000000] relative flex items-center border-2 border-card-foreground rounded-lg px-4 py-2 transition-colors"
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept={accept}
                        className="hidden"
                    />

                    <input
                        type="text"
                        value={text}
                        onChange={(e) => { setText(e.target.value); onTextChange?.(e.target.value); }}
                        placeholder="Type your topic to generate exam..."
                        className="flex-1 bg-transparent text-foreground placeholder:text-gray-400 outline-none"
                        disabled={disabled}
                    />

                    <Button
                        variant="fit"
                        size="xs"
                        type="button"
                        onClick={triggerFileInput}
                        className="ml-2  transition-all hover:-translate-y-0.5"
                    >
                        <Upload className="w-4 h-4" />
                    </Button>
                </div>
            )}

            {file && (
                <div className="flex items-center justify-between p-4 border-2 border-card-foreground rounded-lg shadow-[4px_4px_0_#000000]">
                    <div className="flex items-center gap-3 text-left">
                        <Upload className="w-8 h-8 text-foreground" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors"
                    >
                        <Trash className="w-5 h-5 text-foreground hover:text-red-400" />
                    </button>
                </div>
            )}

            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
    );
}
