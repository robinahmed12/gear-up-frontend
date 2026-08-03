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