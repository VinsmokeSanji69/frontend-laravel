import {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {Upload, X, FileText, Delete, Trash} from "lucide-react";

interface FileUploadProps {
    onFileSelect?: (file: File | null) => void,
    accept?: string,
    maxSize?: number,
    value?: File | null,
    disabled?: boolean
}

export default function FileUpload({
                                       onFileSelect,
                                       accept = ".pdf,.doc,.docx,.txt",
                                       maxSize = 10,
                                       value,
                                       disabled
                                   }: FileUploadProps) {
    const [file, setFile] = useState<File | null>(value || null);
    const [error, setError] = useState<string>("");
    const [isDragging, setIsDragging] = useState(false);

    // Sync with external value prop
    useEffect(() => {
        if (value !== undefined) {
            setFile(value);
        }
    }, [value]);

    const validateFile = (selectedFile: File): string | null => {
        // Check file type
        const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
        const acceptedTypes = accept.split(',').map(t => t.trim());

        if (!acceptedTypes.includes(fileExtension)) {
            return `Please upload a ${accept} file`;
        }

        // Check file size
        const fileSizeMB = selectedFile.size / 1024 / 1024;
        if (fileSizeMB > maxSize) {
            return `File size must be less than ${maxSize}MB`;
        }

        return null;
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];

        if (selectedFile) {
            const validationError = validateFile(selectedFile);

            if (validationError) {
                setError(validationError);
                setFile(null);
                if (onFileSelect) {
                    onFileSelect(null);
                }
                return;
            }

            setError("");
            setFile(selectedFile);
            if (onFileSelect) {
                onFileSelect(selectedFile);
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            const validationError = validateFile(droppedFile);

            if (validationError) {
                setError(validationError);
                setFile(null);
                if (onFileSelect) {
                    onFileSelect(null);
                }
                return;
            }

            setError("");
            setFile(droppedFile);
            if (onFileSelect) {
                onFileSelect(droppedFile);
            }
        }
    };

    const handleRemove = () => {
        setFile(null);
        setError("");
        if (onFileSelect) {
            onFileSelect(null);
        }
    };

    return (
        <div className="w-full">
            {!file ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-card-foreground rounded-lg p-6 text-center transition-colors ${
                        isDragging ? 'bg-blue-50 border-blue-500' : 'bg-transparent hover:bg-gray-50'
                    }`}
                >
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept={accept}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                        <Upload className={`w-8 h-8 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}/>
                        <Button variant="fit" size="xs" type="button" className="pointer-events-none">
                            Upload File
                        </Button>
                        <p className="text-xs text-gray-500">
                            Drag & drop file here or click to browse
                        </p>
                        <p className="text-xs text-gray-400">
                            {accept.toUpperCase()} • Max {maxSize}MB
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between p-4 border-2 border-card-foreground rounded-lg">
                    <div className="flex items-center gap-3 text-left">
                        <FileText className="w-8 h-8 text-foreground"/>
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors"
                    >
                        <Trash className="w-5 h-5 text-foreground hover:text-red-400"/>
                    </button>
                </div>
            )}

            {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
        </div>
    );
}
