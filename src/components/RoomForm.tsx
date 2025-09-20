import React from 'react';
import { ImageUploader } from './ImageUploader';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Trash2, Home } from 'lucide-react';
import { IMAGE_FIELDS, IMAGE_FIELD_LABELS } from '@/schemas/validation';
import { Control, Controller } from 'react-hook-form';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import type { HomeFormData } from '@/schemas/validation';

interface RoomFormProps {
  roomNumber: number;
  roomIndex: number;
  control: Control<HomeFormData>;
  onRemove: () => void;
  canRemove: boolean;
}

export const RoomForm: React.FC<RoomFormProps> = ({
  roomNumber,
  roomIndex,
  control,
  onRemove,
  canRemove,
}) => {
  return (
    <Card className="animate-slide-up shadow-form">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Home className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="heading-3">Room {roomNumber}</CardTitle>
        </div>
        {canRemove && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onRemove}
            className="flex items-center space-x-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Remove Room</span>
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {IMAGE_FIELDS.map((field) => (
            <div
              key={field}
              className='border-2 border-gray-500 bg-gray-100/2 rounded-md p-2'
            >

              <FormField
                control={control}
                name={`rooms.${roomIndex}.${field}` as any}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUploader
                        label={IMAGE_FIELD_LABELS[field]}
                        name={`room${roomNumber}_${field}`}
                        files={formField.value}
                        onChange={formField.onChange}
                        multiple={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};