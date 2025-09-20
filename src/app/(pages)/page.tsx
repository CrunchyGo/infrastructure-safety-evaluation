'use client';
import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { HomeFormSchema, type HomeFormData, type RoomFormData } from '@/schemas/validation';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { ImageUploader } from '@/components/ImageUploader';
import { RoomForm } from '@/components/RoomForm';
import { Shield, Building2, Plus, Save, User, LogOut, Loader2 } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useSubmitInspection } from '@/service';
import AlertModal from '@/components/ui/alert-dialog';

const Home = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();


  const form = useForm<HomeFormData>({
    resolver: yupResolver(HomeFormSchema),
    defaultValues: {
      schoolName: '',
      boardFile: null as any,
      state: '',
      district: '',
      block: '',
      rooms: [{}] as RoomFormData[],
    },
  });

  const { mutate: submitInspection, isPending: isSubmitPending } = useSubmitInspection({
    onSuccess: (data) => {
      toast.success('Inspection Submitted');
      form.reset();
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'rooms',
  });

  const addRoom = () => {
    append({} as RoomFormData);
  };

  const removeRoom = (roomIndex: number) => {
    remove(roomIndex);
  };

  const onSubmit = (data: HomeFormData) => {
    console.log('data', data);
    const formData = new FormData();

    const ROOM_IMAGE_FIELDS = [
      "interiorCeiling",
      "interiorFrontWall",
      "interiorRightWall",
      "interiorBackWall",
      "interiorLeftWall",
      "interiorFloor",
      "exteriorFrontWall",
      "exteriorRightWall",
      "exteriorLeftWall",
      "exteriorBackWall",
      "roof",
    ];

    formData.append("schoolName", data.schoolName);
    formData.append("state", data.state);
    formData.append("district", data.district);
    formData.append("block", data.block);
    formData.append("udiseCode", user?.udiseCode || '');

    // ✅ Single file
    if (data.boardFile?.[0]) {
      console.log('data.boardFile', data.boardFile);
      formData.append("boardFile", data.boardFile[0]);
    }

    data.rooms.forEach((room, i) => {
      for (const field of ROOM_IMAGE_FIELDS) {
        if (room[field].length > 0) {
          for (const file of room[field]) {
            if (file) {
              formData.append(`rooms[${i}][${field}]`, file);
            }
          }
        }
      }
    })
    // 🚀 Send FormData
    submitInspection(formData);
  };


  const handleLogout = () => {
    logout();
    router.push('/login');
    toast.success('Logged Out');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-hero shadow-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-8">
            <div className="flex flex-col lg:flex-row items-center space-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Infrastructure Safety Evaluation</h1>
                <p className="text-white/80 text-sm">School Safety Inspection System</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white">
                <User className="h-5 w-5" />
                <div className="text-right">
                  <p className="font-medium">{user?.udiseCode || 'Inspector'}</p>
                  <p className="text-sm text-white/80">UDISE: {user?.udiseCode}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* School Information */}
            <Card className="shadow-form">
              <CardHeader>
                <CardTitle className="heading-2">School Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="form-grid">
                  <FormField
                    control={form.control}
                    name="schoolName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter school name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter state name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>District Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter district name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="block"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Block Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter block name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="boardFile"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageUploader
                            label="Board Document"
                            name="boardFile"
                            files={field.value}
                            onChange={field.onChange}
                            multiple={false}
                            accept="image/jpeg,image/jpg,image/png"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Rooms Section */}
            <div className="space-y-6">
              <h2 className="heading-2">Room Inspections</h2>

              {fields.map((field, index) => (
                <RoomForm
                  key={field.id}
                  roomNumber={index + 1}
                  roomIndex={index}
                  control={form.control}
                  onRemove={() => removeRoom(index)}
                  canRemove={fields.length > 1}
                />
              ))}
            </div>

            <Button
              type="button"
              variant="secondary"
              onClick={addRoom}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Room</span>
            </Button>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                variant="professional"
                size="lg"
                disabled={isSubmitPending}
                className="flex items-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>
                  {isSubmitPending ? 'Submitting Inspection...' : 'Submit Inspection'}
                </span>
              </Button>
            </div>
          </form>
        </Form>
      </main>

      {
        isSubmitPending &&
        <AlertModal
          title="Submitting Inspection"
          open={isSubmitPending}
          description="Please wait while we submit the inspection. It may take a 2-3 minutes to complete depending on the network speed."
          contentClassName='w-[30rem]'
        >
          <div className="flex items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
        </AlertModal>
      }
    </div>
  );
};

export default Home;