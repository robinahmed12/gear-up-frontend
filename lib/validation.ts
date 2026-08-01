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