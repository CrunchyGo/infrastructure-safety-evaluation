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

// Optional file validation helper for exterior fields
const optionalFileValidation = yup
  .mixed()

// Single file validation for board document
const singleFileValidation = yup
  .mixed()
  .required('Board document is required')

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
  interiorFrontWall: 'Interior Front Wall (भीतरी सामने की दीवार)',
  interiorRightWall: 'Interior Right Wall (भीतरी दायीं दीवार)',
  interiorBackWall: 'Interior Back Wall (भीतरी पिछली दीवार)',
  interiorLeftWall: 'Interior Left Wall (भीतरी बायीं दीवार)',
  interiorCeiling: 'Interior Ceiling (भीतरी छत)',
  interiorFloor: 'Interior Floor (भीतरी फ़र्श)',
  exteriorBackWall: 'Exterior Back Wall (बाहरी पिछली दीवार)',
  exteriorLeftWall: 'Exterior Left Wall (बाहरी बायीं दीवार)',
  exteriorFrontWall: 'Exterior Front Wall (बाहरी सामने की दीवार)',
  exteriorRightWall: 'Exterior Right Wall (बाहरी दायीं दीवार)',
  surroundingAreaOfBackwall: 'Surrounding Area of Backwall (पिछली दीवार की नींव के आसपास का क्षेत्र)',
  surroundingAreaOfLeftwall: 'Surrounding Area of Leftwall (बायीं दीवार की नींव के आसपास का क्षेत्र)',
  surroundingAreaOfFrontwall: 'Surrounding Area of Frontwall (सामने की दीवार की नींव के आसपास का क्षेत्र)',
  surroundingAreaOfRightwall: 'Surrounding Area of Rightwall (दायीं दीवार की नींव के आसपास का क्षेत्र)',
  roof: 'Roof (ऊपरी छत)',
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