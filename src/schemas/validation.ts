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

// File validation helper for required fields
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

// Optional file validation helper for exterior fields
const optionalFileValidation = yup
  .mixed()
  .test('fileSize', 'File size must be less than 5MB', (value: any) => {
    if (!value || !value.length) return true; // Allow empty
    return Array.from(value).every((file: any) => file.size <= 5242880); // 5MB
  })
  .test('fileType', 'Only JPG, PNG files are allowed', (value: any) => {
    if (!value || !value.length) return true; // Allow empty
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

// Interior room image fields (required)
const interiorImageFields = [
  'interiorFrontWall',
  'interiorRightWall',
  'interiorBackWall',
  'interiorLeftWall',
  'interiorCeiling',
  'interiorFloor',
  'roof'
];

// Exterior room image fields (optional)
const exteriorImageFields = [
  'exteriorFrontWall',
  'exteriorRightWall',
  'exteriorLeftWall',
  'exteriorBackWall',
  'surroundingAreaOfBackwall',
  'surroundingAreaOfLeftwall',
  'surroundingAreaOfFrontwall',
  'surroundingAreaOfRightwall'
];

// Room Schema
export const RoomSchema = yup.object({
  // Interior fields (required)
  ...interiorImageFields.reduce((acc, field) => {
    acc[field] = fileValidation;
    return acc;
  }, {} as Record<string, any>),
  // Exterior fields (optional)
  ...exteriorImageFields.reduce((acc, field) => {
    acc[field] = optionalFileValidation;
    return acc;
  }, {} as Record<string, any>),
});

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
  interiorFrontWall: 'Interior Front Wall (अंदर का सामने का दीवार)',
  interiorRightWall: 'Interior Right Wall (अंदर का दायां दीवार)',
  interiorBackWall: 'Interior Back Wall (अंदर का पिछला दीवार)',
  interiorLeftWall: 'Interior Left Wall (अंदर का बायां दीवार)',
  interiorCeiling: 'Interior Ceiling (अंदर की छत)',
  interiorFloor: 'Interior Floor (अंदर का फर्श)',
  exteriorBackWall: 'Exterior Back Wall (बाहर का पिछला दीवार)',
  exteriorLeftWall: 'Exterior Left Wall (बाहर का बायां दीवार)',
  exteriorFrontWall: 'Exterior Front Wall (बाहर का सामने का दीवार)',
  exteriorRightWall: 'Exterior Right Wall (बाहर का दायां दीवार)',
  surroundingAreaOfBackwall: 'Surrounding Area of Backwall (पिछले दीवार के आसपास का क्षेत्र)',
  surroundingAreaOfLeftwall: 'Surrounding Area of Leftwall (बाएं दीवार के आसपास का क्षेत्र)',
  surroundingAreaOfFrontwall: 'Surrounding Area of Frontwall (सामने के दीवार के आसपास का क्षेत्र)',
  surroundingAreaOfRightwall: 'Surrounding Area of Rightwall (दाएं दीवार के आसपास का क्षेत्र)',
  roof: 'Roof (छत)',
} as const;

// Required fields for UI indicators
export const REQUIRED_FIELDS = [
  'interiorCeiling',
  'interiorFrontWall',
  'interiorRightWall',
  'interiorBackWall',
  'interiorLeftWall',
  'interiorFloor',
  'roof'
] as const;

export const IMAGE_FIELDS = Object.keys(IMAGE_FIELD_LABELS) as Array<keyof typeof IMAGE_FIELD_LABELS>;