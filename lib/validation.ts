import z from "zod";

// ALL Zod schemas in one file, used as React Hook Form resolvers: loginSchema, registerSchema, gearSchema, rentNowSchema (refine endDate > startDate), reviewSchema
export const rentNowSchema = z.object({
  startDate: z.date({
    required_error: "Start date is required",
  }),

  endDate: z.date({
    required_error: "End date is required",
  }),
})
.refine(
  (data) =>
    data.endDate >= data.startDate,
  {
    message:
      "End date must be after start date",
    path:["endDate"],
  }
);



export const gearSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(150),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(2000),
  brand: z.string().trim().max(100).optional(),
  pricePerDay: z.coerce.number({ invalid_type_error: 'Enter a price' }).positive('Price must be greater than 0'),
  stock: z.coerce.number().int('Stock must be a whole number').nonnegative('Stock cannot be negative'),
  categoryId: z.string().min(1, 'Select a category'),
  images: z
    .array(z.string().url('Each image must be a valid URL'))
    .min(1, 'Add at least one image')
    .max(6, 'Up to 6 images'),
});

export type GearFormValues = z.infer<typeof gearSchema>;



export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().trim().max(20).optional().or(z.literal('')),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ['confirmNewPassword'],
  });

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;