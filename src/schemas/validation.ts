import * as yup from 'yup';

// Login Schema
export const LoginSchema = yup.object({
  udiseCode: yup
    .string()
    .required('UDISE Code is required')
    .matches(/^\d{6,}$/, 'UDISE Code must be at least 6 digits')
    .min(6, 'UDISE Code must be at least 6 digits'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

// File validation helper
const fileValidation = yup
  .mixed()
  .required('This field is required')
  .test('fileSize', 'File size must be less than 5MB', (value: any) => {
    if (!value || !value.length) return false;
    return Array.from(value).every((file: any) => file.size <= 5242880); // 5MB
  })
  .test('fileType', 'Only JPG, PNG files are allowed', (value: any) => {
    if (!value || !value.length) return false;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    return Array.from(value).every((file: any) => allowedTypes.includes(file.type));
  });

// Single file validation for board document
const singleFileValidation = yup
  .mixed()
  .required('Board document is required')
  .test('fileSize', 'File size must be less than 10MB', (value: any) => {
    if (!value || !value.length) return false;
    return value[0]?.size <= 10485760; // 10MB
  })
  .test('fileType', 'Only JPG, PNG files are allowed', (value: any) => {
    if (!value || !value.length) return false;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    return allowedTypes.includes(value[0]?.type);
  });

// Room image fields
const roomImageFields = [
  'interiorCeiling',
  'interiorFrontWall',
  'interiorRightWall',
  'interiorBackWall',
  'interiorLeftWall',
  'interiorFloor',
  'exteriorFrontWall',
  'exteriorRightWall',
  'exteriorLeftWall',
  'exteriorBackWall',
  'roof',
];

// Room Schema
export const RoomSchema = yup.object(
  roomImageFields.reduce((acc, field) => {
    acc[field] = fileValidation;
    return acc;
  }, {} as Record<string, any>)
);

// Home Form Schema
export const HomeFormSchema = yup.object({
  schoolName: yup.string().required('School name is required'),
  boardFile: singleFileValidation,
  state: yup.string().required('State name is required'),
  district: yup.string().required('District name is required'),
  block: yup.string().required('Block name is required'),
  rooms: yup
    .array()
    .of(RoomSchema)
    .min(1, 'At least one room is required')
    .required('Rooms are required'),
});

export type LoginFormData = yup.InferType<typeof LoginSchema>;
export type HomeFormData = yup.InferType<typeof HomeFormSchema>;
export type RoomFormData = yup.InferType<typeof RoomSchema>;

// Image field labels for UI
export const IMAGE_FIELD_LABELS = {
  interiorCeiling: 'Interior Ceiling',
  interiorFrontWall: 'Interior Front Wall',
  interiorRightWall: 'Interior Right Wall',
  interiorBackWall: 'Interior Back Wall',
  interiorLeftWall: 'Interior Left Wall',
  interiorFloor: 'Interior Floor',
  exteriorFrontWall: 'Exterior Front Wall',
  exteriorRightWall: 'Exterior Right Wall',
  exteriorLeftWall: 'Exterior Left Wall',
  exteriorBackWall: 'Exterior Back Wall',
  roof: 'Roof',
} as const;

export const IMAGE_FIELDS = Object.keys(IMAGE_FIELD_LABELS) as Array<keyof typeof IMAGE_FIELD_LABELS>;