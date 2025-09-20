import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Label } from '@/components/ui/label';

interface ImageUploaderProps {
  label: string;
  name: string;
  files: FileList | null | any;
  onChange: (files: FileList | null) => void;
  error?: string;
  multiple?: boolean;
  accept?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  name,
  files,
  onChange,
  error,
  multiple = true,
  accept = 'image/jpeg,image/jpg,image/png',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      // Merge new files with existing files
      const dt = new DataTransfer();

      // Add existing files first
      if (files && files.length > 0) {
        Array.from(files as FileList).forEach((file) => dt.items.add(file));
      }

      // Add new files
      Array.from(selectedFiles as FileList).forEach((file) => dt.items.add(file));

      const mergedFiles = dt.files;
      onChange(mergedFiles);

      // Update previews for all image files
      const allFiles = Array.from(mergedFiles);
      const imageFiles = allFiles.filter(file => file.type.startsWith('image/'));

      if (imageFiles.length > 0) {
        const newPreviews: string[] = [];
        let loadedCount = 0;

        imageFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            newPreviews.push(e.target?.result as string);
            loadedCount++;
            if (loadedCount === imageFiles.length) {
              setPreviews(newPreviews);
            }
          };
          reader.readAsDataURL(file);
        });
      }
    }

    // Clear the input to allow selecting the same files again
    e.target.value = '';
  };

  const handleRemoveFile = (index: number) => {
    if (files && files.length > 0) {
      const dt = new DataTransfer();
      const fileArray = Array.from(files) as File[];

      fileArray.forEach((file, i) => {
        if (i !== index) {
          dt.items.add(file);
        }
      });

      const newFiles = dt.files.length > 0 ? dt.files : null;
      onChange(newFiles);

      // Update previews
      const newPreviews = previews.filter((_, i) => i !== index);
      setPreviews(newPreviews);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const fileCount = files ? (files.length || 0) : 0;
  const hasFiles = fileCount > 0;

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-foreground">
        {label} {multiple && '(Multiple files allowed)'}
      </Label>

      <div
        className={`upload-area ${error ? 'border-destructive' : ''}`}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          id={name}
          name={name}
          type="file"
          capture="environment"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="text-center">
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">
            {hasFiles ? `${fileCount} file${fileCount > 1 ? 's' : ''} selected` : 'Click to Add Images'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {multiple ? 'JPG, PNG up to 5MB each' : 'JPG, PNG up to 10MB'}
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}


      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative w-fit group"
            >
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="max-h-[15rem] w-auto object-cover rounded-lg border"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveFile(index);
                }}
                className="flex items-center justify-center absolute -top-1 -right-1 h-5 w-5 rounded-full cursor-pointer bg-black"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};